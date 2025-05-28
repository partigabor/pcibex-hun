PennController.ResetPrefix(null); // Shorten command names (keep this line here))

//DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

//loading first set of stimuli
PreloadZip("https://chineseclozetestfeminine.s3.eu-north-1.amazonaws.com/F03M03_wav.zip");
////https://mondo1.dreamhosters.com/MingProjects/clippedaudiofem1.zip

Sequence("consent","participant_ID","setcounter","introduction","introduction2","practice1","practice2","pract2attention","practice3","pract3attention",
        "start_experiment",rshuffle("exp1-fema", "exp1-femb","exp1-masa","exp1-masb","exp1-attentiona","exp1-attentionb"),"break", 
        rshuffle("exp2-fema", "exp2-femb","exp2-masa","exp2-masb","exp2-attentiona","exp2-attentionb"),
        "audioconfirm","posttest1","posttest1_gender1","posttest2","posttest2_gender2","posttest3","posttest3_gender3","posttest4","posttest4_gender4","Final-Q",SendResults(), "survey", "end");

        
CheckPreloaded();
// "survey","sliderTrial",

// Consent
newTrial("consent",
    newHtml("rspr_consent", "consent.html")
        .cssContainer({"margin":"1em"})
        .print()
    ,
newHtml("form", `<div class='fancy'><input name='consent' id='consent' type='checkbox'><label for='consent'>我同意参加本实验。</label></div>`)
        .cssContainer({"margin":"1em"})
        .print()
        .log()
    ,
    newFunction( () => $("#consent").change( e=>{
        if (e.target.checked) getButton("go_to_info").enable()._runPromises();
        else getButton("go_to_info").disable()._runPromises();
    }) ).call()
    ,
    newButton("go_to_info", "继续")
        .cssContainer({"margin":"1em"})
        .disable()
        .print()
        .wait()
);

//SetCounter("setcounter");
newTrial("participant_ID",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("participant_ID", "请输入您的实验ID ")
        .center()
        .print()
    ,
    newTextInput("ID")
        .center()
        .log()
        .print()
    ,
    newButton("go_to_info", "继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(getTextInput("ID").test.text( /^P\d{3}$/ ) 
        .failure( newText("请输入正确 ID，如有问题，请询问实验员。").print()))
    ,
    newVar("ID")
        .global()
        .set(getTextInput("ID"))
        .log()
)
.log( "ID" , getVar("ID") 
); 


SetCounter("setcounter");

//demographic info
newTrial("introduction",
    defaultText
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,
    newText("<b>请完成以下基本信息和语言背景调查。<br/> 请简短回答。</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .print()
    ,
    // Form
    newHtml("demo", `<table>
    <tr>
        <td colspan="2">请选择性别：</td>
        <td>
            <input name="gender" type="radio" value="female" class="obligatory" id="female"><label for="female">女</label>
            <input name="gender" type="radio" value="male" id="male"><label for="male">男</label>
            <input name="gender" type="radio" value="nonbinary" id="nonbinary"><label for="nonbinary">非两元性别</label>
        </td>
    </tr>
    <tr>
        <td colspan="2"></td>
        <td>
            <input name="gender" type="radio" value="othergender" id="othergender"><label for="othergender">其他</label>
            <textarea name="othergenderText" id="othergenderText" rows="1" cols="30" placeholder="如果选择“其他”，请在此输入"></textarea>
        </td>
    </tr>
    <tr>
        <td colspan="2">年龄：</td><td colspan="2"> <textarea name="age" class="obligatory" rows="5" cols="40"></textarea>
        </td>
    </tr>
    <tr><td colspan="2">您的母语（您学会的第一种语言）？</td><td colspan="2">  <textarea name="natlang" class="obligatory" rows="5" cols="40"></textarea>
        </td>
    </tr>
    <tr><td colspan="2">您主要讲什么语言？</td><td colspan="2"><textarea name="domlang" class="obligatory" rows="5" cols="40"></textarea>
        </td>
    </tr>
    <tr><td colspan="2">您讲任何其他语言吗（比如，粤语，英语，闽南话）？</td><td colspan="2"> <textarea name="otherlang" class="obligatory" rows="5" cols="40"></textarea>
        </td>
    </tr>
</table>
<script>
    document.getElementById("othergender").addEventListener("change", function() {
        document.getElementById("othergenderText").disabled = !this.checked;
    });

    document.querySelectorAll("input[name='gender']").forEach(function(radio) {
        radio.addEventListener("change", function() {
            if (this.value !== "othergender") {
                document.getElementById("othergenderText").disabled = true;
                document.getElementById("othergenderText").value = "";
            } else {
                document.getElementById("othergenderText").disabled = false;
            }
        });
    });
</script>`)
        .cssContainer({"margin":"1em"})
        .print()
        .log()
    ,
    newButton("go_to_instruction", "继续")
        .cssContainer({"margin":"1em"})
        .print()
        .wait(
            getHtml("demo").test.complete()
                .and(
                    newFunction(() => {
                        let selectedGender = document.querySelector("input[name='gender']:checked")?.value;
                        let otherText = document.getElementById("othergenderText").value.trim();
                        return selectedGender !== "othergender" || (selectedGender === "othergender" && otherText.length > 0);
                    }).test.is(true)
                )
                .failure(newText("error", "如果选择“其他”，请填写性别信息！").color("red").print())
        )
);

//instructions
newTrial("introduction2",
    newText("instructions", "实验中，你会听到和阅读一些句子，所以请<b>打开耳机或音响</b>。请播放下方的音频确保您能听到句子。<p>所有句子都是真实对话片段，只有最后一个词语被实验人员删掉了。请您听完音频后，在空白处填写您想到的<b>第一个中文词语(不超过三个字)</b>，帮助<b>说话人</b>完成一个完整且有意义的句子，无需作过多思考。</p>")
     .cssContainer({"margin":"0.3em"})
     .print()
     ,
    newText("instr1", "例如，你会听到一位说话人说一个句子（请播放以下音频）：")
    .cssContainer({"margin":"0.3em"})
     .print()
     ,
    newText("spacer0", "<br/>")
        .print()
    ,
    newCanvas("audio_with_input", 800, 50) // Adjust width as needed
        .add(30, 10, newText("instructionspeaker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio("test", "F03_A001.wav").cssContainer({"margin-right":"1em"})
            .print()
            // .play()
            ) 
        .add(430, 12, newTextInput("instructionanswer") // Position input to the right of the player
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .lines(1)
            .hidden() // Initially hidden
            .text("生命 (此为例子，无需填写)")
        )
        .print()
    ,
    getAudio("test").wait() // Wait for the audio to finish
    ,
    getTextInput("instructionanswer").visible() // Show input box after audio finishes
    ,
    newText("spacer0", "<br/>")
        .print()
    ,
    newText("instr3", "请在空格里填写出您想到的第一个中文词语，比如：生命。")
    .cssContainer({"margin":"0.3em"})
     .print()
     , 
    newText("instr4", "请注意：实验过程会随机出现关于前一个句子的内容的小测试，请认真完成所有问题。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实验完成后会有一份问卷调查。")
    .cssContainer({"margin":"0.3em"})
     .print()
     , 
    newText("spacer2", "<br/><br/>")
    .print()
    ,
    newText("instr5", "请完成以下问题，准备开始练习。")
    .cssContainer({"margin":"0.3em"})
     .print()
    , 
    newText("Q1","1. 你可以填写多少个词语？<br/>")
    .cssContainer({"margin":"0.3em"})
     .print()
    ,
    newScale("Q1A", "只有一个","无所谓多少")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .print()
    ,
    newText("Q2","2. 你需要根据谁的角色完成句子？<br/>")
    .cssContainer({"margin":"0.3em"})
     .print()
    ,
    newScale("Q2A", "你自己","说话人")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .print()
    ,
     newText("Q3","3. 实验中有音频吗？<br/>")
    .cssContainer({"margin":"0.3em"})
     .print()
     ,
     newScale("Q3A", "没有","有的")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .print()
    ,
     newText("Q4","4. 你能听见上面的音频吗？<br/>")
    .cssContainer({"margin":"0.3em"})
     .print()
     ,
     newScale("Q4A", "能","不能")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .print()
    ,
    newText("提示", "<i>请完成本页所有问题再继续</i>")
    .cssContainer({"margin":"1em"})
     .print()
     ,
    newButton("go_to_pratice", "开始练习")
        .cssContainer({"margin":"0.4em"})
        .print()
        .wait(
             // Ensure all scales are selected
            getScale("Q1A").test.selected()
            .and(getScale("Q2A").test.selected())
            .and(getScale("Q3A").test.selected())
            // Validate correct answers
            .and(getScale("Q1A").test.selected("只有一个"))
            .and(getScale("Q2A").test.selected("说话人"))
            .and(getScale("Q3A").test.selected("有的"))
            .and(getScale("Q4A").test.selected("能"))
            .failure(
                newText("错误", "请确保所有问题都正确回答后再开始练习！")
                    .cssContainer({"color": "red", "margin":"1em"})
                    .print()
            )
        )
);

newTrial("practice1",
    newText("pratice1", "练习1: ")
    // <br/><br/>请帮说话人完成句子(不超过三个字)
        .cssContainer({"margin":"0.3em"})
        .print()
      ,
    newText("spacer3", "<br/>")
        .print()
    ,
    newText("prac1instruction", "请用一个词语帮说话人完成句子，你可以重复播放音频。")
        .print()
    ,
    newText("spacer3", "<br/>")
        .print()
    ,
    newCanvas("practice1b", 800, 50) // Adjust width as needed
        .add(30, 10, newText("practice1a", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio("test", "M03_A069.wav").cssContainer({"margin-right":"1em"}).print().play()) 
        .add(430, 12, newTextInput("practice1answer") // Position input to the right of the player
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .log()
            .lines(1)
            .hidden() // Initially hidden
        )
        .print()
    ,
    getAudio("test").wait() // Wait for the audio to finish
    ,
    getTextInput("practice1answer").visible() // Show input box after audio finishes
    ,
    newText("spacer4", "<br/>")
        .print()
    ,
    newText("error1", "请在上方空格处用一个词语帮说话人完成句子")
        .color("red")
        .cssContainer({"margin-top":"0.5em"})
        .center()
        .print()
        .hidden()
    ,
    newButton("go_to_practice2", "继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(
            getTextInput("practice1answer")
                .test.text(/.+/) // Check if there is at least one character
                .failure(getText("error1").visible()) // Show error message if empty
        )
);

newTrial("practice2",
    newText("pratice2", "练习2: ")
        .cssContainer({"margin":"1em"})
        .print()
    ,
       newText("spacer5", "<br/>")
        .print()
    ,
    newCanvas("practice2b", 800, 50) // Adjust width as needed
        .add(30, 10, newText("practice2a", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio("test2", "M03_A005.wav").cssContainer({"margin-right":"1em"}).print().play()) 
        .add(430, 12, newTextInput("practice2answer") // Position input to the right of the player
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .log()
            .lines(1)
            .hidden() // Initially hidden
        )
        .print()
    ,
    getAudio("test2").wait() // Wait for the audio to finish
    ,
    getTextInput("practice2answer").visible() // Show input box after audio finishes
    ,
    newText("spacer6", "<br/>")
        .print()
    ,
    newText("error2", "请在上方空格处用一个词语帮说话人完成句子")
        .color("red")
        .cssContainer({"margin-top":"0.5em"})
        .center()
        .print()
        .hidden()
    ,
    newButton("go_to_practice3", "继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(
            getTextInput("practice2answer")
                .test.text(/.+/) // Check if there is at least one character
                .failure(getText("error2").visible()) // Show error message if empty
        )
);

newTrial("pract2attention",
    newText("practice2check", "上一句话中，说话人有没有提到音响？")
        // .cssContainer({"margin-top":"0.5em"})
        .cssContainer({"font-size":"1em", "margin":"1em"})
        .center()
        .print()
    ,
    newScale("practice2check_answer", "没有","有的")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .center()
        .print()
    ,
    // Button to move to the next trial
    newButton("go_to_pratice3", "继续")
        .cssContainer({"margin": "1em"})
        .center()
        .print()
        .wait(
             // Ensure all scales are selected
            getScale("practice2check_answer").test.selected()
            // Validate correct answers
            .and(getScale("practice2check_answer").test.selected("有的"))
            .failure(
                newText("错误", "请确保回答正确后再继续！")
                    .cssContainer({"color": "red", "margin":"1em"})
                    .center()
                    .print()
            )
        )
);

newTrial("practice3",
    newText("pratice3", "练习3: ")
        .cssContainer({"margin":"1em"})
        .print()
    ,
       newText("spacer7", "<br/>")
        .print()
    ,
    newCanvas("practice3b", 800, 50) // Adjust width as needed
        .add(30, 10, newText("practice3a", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio("test3", "F03_A003.wav").cssContainer({"margin-right":"1em"}).print().play()) 
        .add(430, 12, newTextInput("practice3answer") // Position input to the right of the player
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .log()
            .lines(1)
            .hidden() // Initially hidden
        )
        .print()
    ,
    getAudio("test3").wait() // Wait for the audio to finish
    ,
    getTextInput("practice3answer").visible() // Show input box after audio finishes
    ,
    newText("spacer8", "<br/>")
        .print()
    ,
    newText("error3", "请在上方空格处用一个词语帮说话人完成句子")
        .color("red")
        .cssContainer({"margin-top":"0.5em"})
        .center()
        .print()
        .hidden()
    ,
    newButton("go_to_attention", "继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(
            getTextInput("practice3answer")
                .test.text(/.+/) // Check if there is at least one character
                .failure(getText("error3").visible()) // Show error message if empty
        )
);

newTrial("pract3attention",
    newText("practice3check", "上一句话中，你听到的声音是男性还是女性？")
        // .cssContainer({"margin-top":"0.5em"})
        .cssContainer({"font-size":"1em", "margin":"1em"})
        .center()
        .print()
    ,
    newScale("practice3check_answer", "男性","女性")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .center()
        .print()
    ,
    // Button to move to the next trial
    newButton("go_to_main", "开始正式实验")
        .css({"font-size":"1em", "font-weight":"bold"}) // Use `.css()` instead of `.cssContainer()`
        .cssContainer({"margin": "1.2em"}) // Keep margin settings
        .center()
        .print()
        .wait(
             // Ensure all scales are selected
            getScale("practice3check_answer").test.selected()
            // Validate correct answers
            .and(getScale("practice3check_answer").test.selected("女性"))
            .failure(
                newText("错误", "请确保回答正确后再继续！")
                    .cssContainer({"color": "red", "margin":"1em"})
                    .center()
                    .print()
            )
        )
);

// Template("item.csv", row =>
//     newTrial( "exp1-"+row.cond+row.group,
//     newCanvas("exp", 800, 50) // Adjust width as needed
//         .add(30, 10, newText("exptalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
//         .add(120, 0, newAudio(row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
//         .add(430, 12, newTextInput("answer") 
//             .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
//             // .log()
//             .lines(1)
//             .hidden() // Initially hidden
//         )
//         .print()
//     ,
//     getAudio(row.audiofile).wait() // Wait for the audio to finish
//     ,
//     getTextInput("answer").visible() // Show input box after audio finishes
//     ,
//     newText("space", "<br/>")
//         .print()
//     ,
//     newText("error", "请在上方空格处用一个词语帮说话人完成句子")
//         .color("red")
//         .cssContainer({"margin-top":"0.5em"})
//         .center()
//         .print()
//         .hidden()
//     ,
//     newButton("Continue","继续下一个句子")
//         .cssContainer({"margin":"1em"})
//         .center()
//         .print()
//         .wait(getTextInput("answer")
//                 .test.text(/.+/) // Check if there is at least one character
//                 .failure(getText("error").visible())))
//     .log( "condition"      , row.cond)
//     .log( "item"      , row.item)
//     .log( "group" , row.group)
//     .log("sentence", row.sentence)
//     .log( "ID" , getVar("ID"))
// );


//attention check question
// Template("item-att.csv", row =>
//     newTrial( "att-"+row.cond+row.group,
//         newCanvas("att", 800, 50) // Adjust width as needed
//             .add(30, 10, newText("attentiontalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
//             .add(120, 0, newAudio("attentionaudio",row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
//             .add(430, 12, newTextInput("attentionanswer") 
//                 .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
//                 .lines(1)
//                 .hidden() // Initially hidden
//             )
//             .print()
//         ,
//         getAudio("attentionaudio").wait() // Wait for the audio to finish
//         ,
//         getTextInput("attentionanswer").visible() // Show input box after audio finishes
//         ,
//         newText("space", "<br/>").print()
//         ,
//         newText("error", "请在上方空格处用一个词语帮说话人完成句子")
//             .color("red")
//             .cssContainer({"margin-top":"0.5em"})
//             .center()
//             .print()
//             .hidden()
//         ,
//         newButton("Continue","继续")
//             .cssContainer({"margin":"1em"})
//             .center()
//             .print()
//             .wait(getTextInput("attentionanswer")
//                     .test.text(/.+/) // Check if there is at least one character
//                     .failure(getText("error").visible()))
//         ,
//         // Hide all elements from the first part after clicking "Continue"
//         getCanvas("att").hidden(),
//         getText("attentiontalker").hidden(),
//         getTextInput("attentionanswer").hidden(),
//         getAudio("attentionaudio").hidden(),
//         getButton("Continue").hidden(),
//         getText("error").hidden()
//         ,
//         // New question: Did the speaker mention it? (Centered at top)
//         newCanvas("newQuestion", 800, 50)
//             .add(180, -150, newText("Attention", "刚才说话人提到了 " + row.attentionquestion + " 吗？")
//                 .cssContainer({"font-size":"1.2em", "margin":"1em"}) //"font-weight":"bold",
//                 .center()
//                 .print()
//             )
//             .add(250, -80, newScale("Mention", "没有", "有的")
//                 .radio()
//                 .log()
//                 .labelsPosition("right")
//                 .cssContainer({"margin":"0.4em"})
//                 .print()
//             )
//             .print()
//         ,
//         // New button "继续"
//         newButton("Next", "继续下一个句子")
//             .cssContainer({"margin-top":"1em", "font-size":"1.1em"})
//             .center()
//             .print()
//             .wait(getScale("Mention").test.selected())
//     )
//     .log("condition", row.cond)
//     .log("item", row.item)
//     .log("group", row.group)
//     .log("sentence", row.sentence)
//     .log("ID", getVar("ID"))
// );

Template("item.csv", row =>
    newTrial( "exp1-"+row.cond+row.group,
    ( row.item>=100 ? [
        newCanvas("att", 800, 50) // Adjust width as needed
            .add(30, 10, newText("attentiontalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
            .add(120, 0, newAudio("attentionaudio",row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
            .add(430, 12, newTextInput("attentionanswer") 
                .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
                .log()
                .lines(1)
                .hidden() // Initially hidden
            )
            .print()
        ,
        getAudio("attentionaudio").wait() // Wait for the audio to finish
        ,
        getTextInput("attentionanswer").visible() // Show input box after audio finishes
        ,
        newText("space", "<br/>").print()
        ,
        newText("error", "请在上方空格处用一个词语帮说话人完成句子")
            .color("red")
            .cssContainer({"margin-top":"0.5em"})
            .center()
            .print()
            .hidden()
        ,
        newButton("Continue","继续")
            .cssContainer({"margin":"1em"})
            .center()
            .print()
            .wait(getTextInput("attentionanswer")
                    .test.text(/.+/) // Check if there is at least one character
                    .failure(getText("error").visible()))
        ,
        // Hide all elements from the first part after clicking "Continue"
        getCanvas("att").hidden(),
        getText("attentiontalker").hidden(),
        getTextInput("attentionanswer").hidden(),
        getAudio("attentionaudio").hidden(),
        getButton("Continue").hidden(),
        getText("error").hidden()
        ,
        // New question: Did the speaker mention it? (Centered at top)
        newCanvas("newQuestion", 800, 50)
            .add(200, -150, newText("Attention", "上一句话中，说话人提到了 " + row.attentionquestion + " 吗？")
                .cssContainer({"font-size":"1em", "margin":"1em"}) //"font-weight":"bold",
                .center()
                .print()
            )
            .add(250, -100, newScale("Mention", "没有", "有的")
                .radio()
                .log()
                .labelsPosition("right")
                .cssContainer({"margin":"0.4em"})
                .print()
            )
            .print()
        ,
        newButton("Next", "继续")
            .cssContainer({"margin-top":"-5em", "font-size":"1.1em"})
            .center()
            .print()
            .wait(getScale("Mention").test.selected())
        ]:[ newCanvas("exp", 800, 50) // Adjust width as needed
        .add(30, 10, newText("exptalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio(row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
        .add(430, 12, newTextInput("answer") 
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .log()
            .lines(1)
            .hidden() // Initially hidden
        )
        .print()
    ,
    getAudio(row.audiofile).wait() // Wait for the audio to finish
    ,
    getTextInput("answer").visible() // Show input box after audio finishes
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("error", "请在上方空格处用一个词语帮说话人完成句子")
        .color("red")
        .cssContainer({"margin-top":"0.5em"})
        .center()
        .print()
        .hidden()
    ,
    newButton("Continue","继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(getTextInput("answer")
                .test.text(/.+/) // Check if there is at least one character
                .failure(getText("error").visible()))])
    )
    .log("condition", row.cond)
    .log("item", row.item)
    .log("group", row.group)
    .log("sentence", row.sentence)
    .log("ID", getVar("ID"))
);

//loading second set of stimuli
PreloadZip("https://chineseclozetestfeminine.s3.eu-north-1.amazonaws.com/F03M03_wav.zip");
// https://mondo1.dreamhosters.com/MingProjects/clippedaudiofem2.zip

//Break
newTrial("break",
newText("breaktext", "实验已进行一半，您可以稍作休息。准备好后可以点击下方按钮继续实验。")
        .cssContainer({"margin":"1em"})
        .print()
       ,
    newButton("endbreak", "继续第二部分")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait()
);

Template("item-2.csv", row =>
    newTrial( "exp2-"+row.cond+row.group,
    ( row.item>=100 ? [
        newCanvas("att", 800, 50) // Adjust width as needed
            .add(30, 10, newText("attentiontalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
            .add(120, 0, newAudio("attentionaudio",row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
            .add(430, 12, newTextInput("attentionanswer") 
                .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
                .log()
                .lines(1)
                .hidden() // Initially hidden
            )
            .print()
        ,
        getAudio("attentionaudio").wait() // Wait for the audio to finish
        ,
        getTextInput("attentionanswer").visible() // Show input box after audio finishes
        ,
        newText("space", "<br/>").print()
        ,
        newText("error", "请在上方空格处用一个词语帮说话人完成句子")
            .color("red")
            .cssContainer({"margin-top":"0.5em"})
            .center()
            .print()
            .hidden()
        ,
        newButton("Continue","继续")
            .cssContainer({"margin":"1em"})
            .center()
            .print()
            .wait(getTextInput("attentionanswer")
                    .test.text(/.+/) // Check if there is at least one character
                    .failure(getText("error").visible()))
        ,
        // Hide all elements from the first part after clicking "Continue"
        getCanvas("att").hidden(),
        getText("attentiontalker").hidden(),
        getTextInput("attentionanswer").hidden(),
        getAudio("attentionaudio").hidden(),
        getButton("Continue").hidden(),
        getText("error").hidden()
        ,
        // New question: Did the speaker mention it? (Centered at top)
        newCanvas("newQuestion", 800, 50)
            .add(200, -150, newText("Attention", "上一句话中，说话人提到 " + row.attentionquestion + " 吗？")
                .cssContainer({"font-size":"1em", "margin":"1em"}) //"font-weight":"bold",
                .center()
                .print()
            )
            .add(250, -100, newScale("Mention", "没有", "有的")
                .radio()
                .log()
                .labelsPosition("right")
                .cssContainer({"margin":"0.4em"})
                .print()
            )
            .print(),
                    // New button "继续"
        newButton("Next", "继续")
            .cssContainer({"margin-top":"-5em", "font-size":"1.1em"})
            .center()
            .print()
            .wait(getScale("Mention").test.selected())
        ]:[ newCanvas("exp", 800, 50) // Adjust width as needed
        .add(30, 10, newText("exptalker", "说话人 说:   ").cssContainer({"margin":"0.3em"})) 
        .add(120, 0, newAudio(row.audiofile).cssContainer({"margin-right":"1em"}).print().play()) 
        .add(430, 12, newTextInput("answer") 
            .cssContainer({"width": "150px", "height": "25px"}) // Adjust width & height
            .log()
            .lines(1)
            .hidden() // Initially hidden
        )
        .print()
    ,
    getAudio(row.audiofile).wait() // Wait for the audio to finish
    ,
    getTextInput("answer").visible() // Show input box after audio finishes
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("error", "请在上方空格处用一个词语帮说话人完成句子")
        .color("red")
        .cssContainer({"margin-top":"0.5em"})
        .center()
        .print()
        .hidden()
    ,
    newButton("Continue","继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(getTextInput("answer")
                .test.text(/.+/) // Check if there is at least one character
                .failure(getText("error").visible()))])
    )
    .log("condition", row.cond)
    .log("item", row.item)
    .log("group", row.group)
    .log("sentence", row.sentence)
    .log("ID", getVar("ID"))
);

// confirm voice gender
newTrial("audioconfirm",
    defaultText
        .cssContainer({"margin-bottom":"1em"})
        .center()
        .print()
    ,
    newText("gender_confirm","请问整个实验过程中你听到的是男性还是女性的声音？<br/>")
        .cssContainer({"margin":"0.3em"})
        .center()
        .print()
    ,
    newScale("gender_confirmA", "男性","女性","男女都有")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})
        .center()
        .print()
    ,
    newButton("go_to_posttest1", "开始实验后测试")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(getScale("gender_confirmA").test.selected())
    .log("ID", getVar("ID"))
); 

PreloadZip("https://chineseclozetestfeminine.s3.eu-north-1.amazonaws.com/F03M03_Post_wav.zip");

newTrial("posttest1",
    newText("<b>请依次播放并仔细听以下五个语音片段，请根据你对说话人的第一印象选择下列问题。</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .print()
    ,
    newAudio("talkerF04_A006", "F04_A006_whole.wav").print().wait(), newText("space11", "<br/>").print(),
    newAudio("talkerF04_A011", "F04_A011_whole.wav").print().wait(), newText("space11", "<br/>").print(),
    newAudio("talkerF04_A027", "F04_A027_whole.wav").print().wait(), newText("space11", "<br/>").print(),
    newAudio("talkerF04_A064", "F04_A064_whole.wav").print().wait(), newText("space11", "<br/>").print(),
    newAudio("talkerF04_A078", "F04_A078_whole.wav").print().wait(), newText("space11", "<br/>").print(),

    newText("posttest_a1", "<b>1. 你认为该说话人多少岁？</b>")
        .cssContainer({"margin": "0.3em"})
        // .center()
        .print()
    ,
    newText("scaleValue_a1", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_a1", 500, 20) // Create a container for the slider and labels
        .add(140, 5, newText("left_label1", "0<br>(0 岁)").css("text-align", "center")) 
        .add(180, 0, newScale("age", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_a1").text(getScale("age")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label1", "100<br>(100 岁)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_a1")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space11", "<br/>")
        .print()
    ,
    newText("posttest_a2","<b>2. 你认为该说话人是女性还是男性？</b>")
        .cssContainer({"margin":"0.3em"})
        .print()
    ,
    newScale("gender_answer", "女性","男性")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})//, "display": "flex", "gap": "30px"
        .center()
        .print()
    ,
    newText("posttest_a3", "<b>3. 你认为该说话人友善吗？</b>")    
        .cssContainer({"margin": "0.3em"})
        .print()
    ,
    newText("scaleValue_a3", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_a3", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label3", "0<br>(非常不友善)").css("text-align", "center")) 
        .add(180, 0, newScale("friendliness", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_a3").text(getScale("friendliness")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label3", "100<br>(非常友善)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_a3")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space11", "<br/>")
        .print()
    ,
    newText("posttest_a4","<b>4. 你认为该说话人聪明吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_a4", "").before(newText(" ")),
    newCanvas("sliderContainer_a4", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label4", "0<br>(非常不聪明)").css("text-align", "center")) 
        .add(180, 0, newScale("intelligence", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_a4").text(getScale("intelligence")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label4", "100<br>(非常聪明)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_a4")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space11", "<br/>")
        .print()
    ,
    newText("posttest_a5","<b>5. 你认为该说话人自信吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_a5", "").before(newText(" ")),
    newCanvas("sliderContainer_a5", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label5", "0<br>(非常不自信)").css("text-align", "center")) 
        .add(180, 0, newScale("confidence", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_a5").text(getScale("confidence")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label5", "100<br>(非常自信)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_a5")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
     newText("space11", "<br/>")
        .print()
    ,
    newText("errorMessage", "请完成所有问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getAudio("talkerF04_A006").test.hasPlayed()
                .and(getAudio("talkerF04_A011").test.hasPlayed())
                .and(getAudio("talkerF04_A027").test.hasPlayed())
                .and(getAudio("talkerF04_A064").test.hasPlayed())
                .and(getAudio("talkerF04_A078").test.hasPlayed())
                .and(getScale("age").test.selected()))
                .and(getScale("gender_answer").test.selected())
                .and (getScale("friendliness").test.selected())
                .and (getScale("intelligence").test.selected())
                .and (getScale("confidence").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
);

newTrial("posttest1_gender1",
    newText("posttest_a6","<b>你认为该说话人（上一页中）有多女性化？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_a6", "").before(newText(" ")),
    newCanvas("sliderContainer_a6", 500, 20) // Create a container for the slider and labels
        .add(115, 5, newText("left_label6", "0<br>(非常不女性化)").css("text-align", "center")) 
        .add(180, 0, newScale("sex1", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_a6").text(getScale("sex1")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label6", "100<br>(非常女性化)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_a6")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("errorMessage", "请完成问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getScale("sex1").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
); 

newTrial("posttest2",
    newText("<b>请依次播放并仔细听以下五个语音片段，请根据你对说话人的第一印象选择下列问题。</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .print()
    ,
    newAudio("talkerM03_A006", "M03_A006_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM03_A011", "M03_A011_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM03_A027", "M03_A027_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM03_A064", "M03_A064_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM03_A078", "M03_A078_whole.wav").print().wait(), newText("space", "<br/>").print(),

    newText("posttest_b1", "<b>1. 你认为该说话人多少岁？</b>")
        .cssContainer({"margin": "0.3em"})
        // .center()
        .print()
    ,
    newText("scaleValue_b1", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_b1", 500, 20) // Create a container for the slider and labels
        .add(140, 5, newText("left_label1", "0<br>(0 岁)").css("text-align", "center")) 
        .add(180, 0, newScale("age2", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_b1").text(getScale("age2")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label1", "100<br>(100 岁)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_b1")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_b2","<b>2. 你认为该说话人是女性还是男性？</b>")
        .cssContainer({"margin":"0.3em"})
        .print()
    ,
    newScale("gender_answer2", "女性","男性")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})//, "display": "flex", "gap": "30px"
        .center()
        .print()
    ,
    newText("posttest_b3", "<b>3. 你认为该说话人友善吗？</b>")    
        .cssContainer({"margin": "0.3em"})
        .print()
    ,
    newText("scaleValue_b3", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_b3", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label3", "0<br>(非常不友善)").css("text-align", "center")) 
        .add(180, 0, newScale("friendliness2", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_b3").text(getScale("friendliness2")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label3", "100<br>(非常友善)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_b3")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_b4","<b>4. 你认为该说话人聪明吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_b4", "").before(newText(" ")),
    newCanvas("sliderContainer_b4", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label4", "0<br>(非常不聪明)").css("text-align", "center")) 
        .add(180, 0, newScale("intelligence2", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_b4").text(getScale("intelligence2")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label4", "100<br>(非常聪明)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_b4")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_b5","<b>5. 你认为该说话人自信吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_b5", "").before(newText(" ")),
    newCanvas("sliderContainer_b5", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label5", "0<br>(非常不自信)").css("text-align", "center")) 
        .add(180, 0, newScale("confidence2", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_b5").text(getScale("confidence2")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label5", "100<br>(非常自信)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_b5")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
     newText("space", "<br/>")
        .print()
    ,
    newText("errorMessage", "请完成所有问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getAudio("talkerM03_A006").test.hasPlayed()
                .and(getAudio("talkerM03_A011").test.hasPlayed())
                .and(getAudio("talkerM03_A027").test.hasPlayed())
                .and(getAudio("talkerM03_A064").test.hasPlayed())
                .and(getAudio("talkerM03_A078").test.hasPlayed())
                .and(getScale("age2").test.selected()))
                .and(getScale("gender_answer2").test.selected())
                .and(getScale("friendliness2").test.selected())
                .and(getScale("intelligence2").test.selected())
                .and(getScale("confidence2").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
);

newTrial("posttest2_gender2",
    newText("posttest_b6","<b>你认为该说话人（上一页中）有多男性化？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_b6", "").before(newText(" ")),
    newCanvas("sliderContainer_b6", 500, 20) // Create a container for the slider and labels
        .add(115, 5, newText("left_label6", "0<br>(非常不男性化)").css("text-align", "center")) 
        .add(180, 0, newScale("sex2", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_b6").text(getScale("sex2")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label6", "100<br>(非常男性化)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_b6")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("errorMessage", "请完成问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getScale("sex2").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
); 

newTrial("posttest3",
    newText("<b>请依次播放并仔细听以下五个语音片段，请根据你对说话人的第一印象选择下列问题。</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .print()
    ,
    newAudio("talkerF03_A006", "F03_A006_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerF03_A011", "F03_A011_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerF03_A027", "F03_A027_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerF03_A064", "F03_A064_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerF03_A078", "F03_A078_whole.wav").print().wait(), newText("space", "<br/>").print(),

    newText("posttest_F03", "<b>1. 你认为该说话人多少岁？</b>")
        .cssContainer({"margin": "0.3em"})
        // .center()
        .print()
    ,
    newText("scaleValue_c1", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_c1", 500, 20) // Create a container for the slider and labels
        .add(140, 5, newText("left_label1", "0<br>(0 岁)").css("text-align", "center")) 
        .add(180, 0, newScale("age3", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_c1").text(getScale("age3")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label1", "100<br>(100 岁)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_c1")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_c2","<b>2. 你认为该说话人是女性还是男性？</b>")
        .cssContainer({"margin":"0.3em"})
        .print()
    ,
    newScale("gender_answer3", "女性","男性")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})//, "display": "flex", "gap": "30px"
        .center()
        .print()
    ,
    newText("posttest_c3", "<b>3. 你认为该说话人友善吗？</b>")    
        .cssContainer({"margin": "0.3em"})
        .print()
    ,
    newText("scaleValue_c3", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_c3", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label3", "0<br>(非常不友善)").css("text-align", "center")) 
        .add(180, 0, newScale("friendliness3", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_c3").text(getScale("friendliness3")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label3", "100<br>(非常友善)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_c3")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_c4","<b>4. 你认为该说话人聪明吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_c4", "").before(newText(" ")),
    newCanvas("sliderContainer_c4", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label4", "0<br>(非常不聪明)").css("text-align", "center")) 
        .add(180, 0, newScale("intelligence3", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_c4").text(getScale("intelligence3")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label4", "100<br>(非常聪明)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_c4")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_c5","<b>5. 你认为该说话人自信吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_c5", "").before(newText(" ")),
    newCanvas("sliderContainer_c5", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label5", "0<br>(非常不自信)").css("text-align", "center")) 
        .add(180, 0, newScale("confidence3", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_c5").text(getScale("confidence3")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label5", "100<br>(非常自信)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_c5")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
     newText("space", "<br/>")
        .print()
    ,
    newText("errorMessage", "请完成所有问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getAudio("talkerF03_A006").test.hasPlayed()
                .and(getAudio("talkerF03_A011").test.hasPlayed())
                .and(getAudio("talkerF03_A027").test.hasPlayed())
                .and(getAudio("talkerF03_A064").test.hasPlayed())
                .and(getAudio("talkerF03_A078").test.hasPlayed())
                .and(getScale("age3").test.selected()))
                .and(getScale("gender_answer3").test.selected())
                .and(getScale("friendliness3").test.selected())
                .and(getScale("intelligence3").test.selected())
                .and(getScale("confidence3").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
);

newTrial("posttest3_gender3",
    newText("posttest_c6","<b>你认为该说话人（上一页中）有多女性化？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_c6", "").before(newText(" ")),
    newCanvas("sliderContainer_c6", 500, 20) // Create a container for the slider and labels
        .add(115, 5, newText("left_label6", "0<br>(非常不女性化)").css("text-align", "center")) 
        .add(180, 0, newScale("sex3", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_c6").text(getScale("sex3")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label6", "100<br>(非常女性化)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_c6")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("errorMessage", "请完成问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getScale("sex3").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
); 

newTrial("posttest4",
    newText("<b>请依次播放并仔细听以下五个语音片段，请根据你对说话人的第一印象选择下列问题。</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .print()
    ,
    newAudio("talkerM05_A006", "M05_A006_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM05_A011", "M05_A011_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM05_A027", "M05_A027_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM05_A064", "M05_A064_whole.wav").print().wait(), newText("space", "<br/>").print(),
    newAudio("talkerM05_A078", "M05_A078_whole.wav").print().wait(), newText("space", "<br/>").print(),

    newText("posttest_M05", "<b>1. 你认为该说话人多少岁？</b>")
        .cssContainer({"margin": "0.3em"})
        // .center()
        .print()
    ,
    newText("scaleValue_d1", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_d1", 500, 20) // Create a container for the slider and labels
        .add(140, 5, newText("left_label1", "0<br>(0 岁)").css("text-align", "center")) 
        .add(180, 0, newScale("age4", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_d1").text(getScale("age4")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label1", "100<br>(100 岁)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_d1")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_d2","<b>2. 你认为该说话人是女性还是男性？</b>")
        .cssContainer({"margin":"0.3em"})
        .print()
    ,
    newScale("gender_answer4", "女性","男性")
        .radio()
        .log()
        .labelsPosition("right")
        .cssContainer({"margin":"0.4em"})//, "display": "flex", "gap": "30px"
        .center()
        .print()
    ,
    newText("posttest_d3", "<b>3. 你认为该说话人友善吗？</b>")    
        .cssContainer({"margin": "0.3em"})
        .print()
    ,
    newText("scaleValue_d3", "").before(newText(" "))
    ,
    newCanvas("sliderContainer_d3", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label3", "0<br>(非常不友善)").css("text-align", "center")) 
        .add(180, 0, newScale("friendliness4", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_d3").text(getScale("friendliness4")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label3", "100<br>(非常友善)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_d3")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_d4","<b>4. 你认为该说话人聪明吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_d4", "").before(newText(" ")),
    newCanvas("sliderContainer_d4", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label4", "0<br>(非常不聪明)").css("text-align", "center")) 
        .add(180, 0, newScale("intelligence4", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_d4").text(getScale("intelligence4")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label4", "100<br>(非常聪明)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_d4")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("space", "<br/>")
        .print()
    ,
    newText("posttest_d5","<b>5. 你认为该说话人自信吗？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_d5", "").before(newText(" ")),
    newCanvas("sliderContainer_d5", 500, 20) // Create a container for the slider and labels
        .add(125, 5, newText("left_label5", "0<br>(非常不自信)").css("text-align", "center")) 
        .add(180, 0, newScale("confidence4", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_d5").text(getScale("confidence4")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label5", "100<br>(非常自信)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_d5")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
     newText("space", "<br/>")
        .print()
    ,
    newText("errorMessage", "请完成所有问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getAudio("talkerM05_A006").test.hasPlayed()
                .and(getAudio("talkerM05_A011").test.hasPlayed())
                .and(getAudio("talkerM05_A027").test.hasPlayed())
                .and(getAudio("talkerM05_A064").test.hasPlayed())
                .and(getAudio("talkerM05_A078").test.hasPlayed())
                .and(getScale("age4").test.selected()))
                .and(getScale("gender_answer4").test.selected())
                .and(getScale("friendliness4").test.selected())
                .and(getScale("intelligence4").test.selected())
                .and(getScale("confidence4").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
);

newTrial("posttest4_gender4",
    newText("posttest_d6","<b>你认为该说话人（上一页中）有多男性化？</b>")
        .cssContainer({"margin": "0.3em"})
        .print(),
    newText("scaleValue_d6", "").before(newText(" ")),
    newCanvas("sliderContainer_d6", 500, 20) // Create a container for the slider and labels
        .add(115, 5, newText("left_label6", "0<br>(非常不男性化)").css("text-align", "center")) 
        .add(180, 0, newScale("sex4", 101)
        .slider()
        .center()
        .callback(getText("scaleValue_d6").text(getScale("sex4")))
        .size(500) // Adjust slider size to fit the layout
        .log()
        )
        .add(310, 5, newText("right_label6", "100<br>(非常男性化)").css("text-align", "center")) // Right label "100"
        .center()
        .print()
    ,
    getText("scaleValue_d6")
        .cssContainer({"margin": "0.25em"})
        .center()
        .print()
    ,
    newText("errorMessage", "请完成问题再继续！")
        .color("red")
        .cssContainer({"margin-top": "1em"})
        .center()
        .hidden()
        .print()
    ,
    newButton("继续")
        .center()
        .print()
        .wait(
           (getScale("sex4").test.selected())
                .success()
                .failure(getText("errorMessage").visible())
        )
    .log("ID", getVar("ID"))
); 

newTrial("Final-Q",
    newText("final-q", "你认为<b>你自己的个性</b>是女性化还是男性化的？")
        .print()
    ,
    newText("scaleValue6", "")
        .before(newText("      "))
    ,
    newScale("SelfGender", 101)
            .slider()
            .center()
            .log()
            .before(newText("Q6F","&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;0<br> (非常女性化)"))
            .after(newText("Q6M","&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;100<br>&nbsp; &nbsp; (非常男性化)"))
            .callback(getText("scaleValue6").text(getScale("SelfGender")))
            .print()
    ,
    getText("scaleValue6")
        .print().center()
    ,
    newText("Hidden-warning", "请完成问题再继续")
        .color("red")
        .hidden()
        .print()
    ,
    newButton("endbreak", "继续")
        .cssContainer({"margin":"1em"})
        .center()
        .print()
        .wait(
            getScale("SelfGender")
            .test.selected()
            .failure(
                getText("Hidden-warning")
                    .visible()
            )
        )
        .log("ID", getVar("ID"))
);

newTrial( "survey",
    newText("非常感谢你完成实验！<br/> <br/> <b>请点击下面链接开始问卷调查：</b>")
        .cssContainer({"margin-top":"1em", "margin-bottom":"0.5em"})
        .center()
        .print()
    ,
    newText("<a href='https://forms.gle/dewCxGjLLmWuTEvo9' target='_blank'>"+
          "问卷调查</a>").center().print()
  ,
    newButton().wait()
);

// Final screen: explanation of the goal
newTrial("end",
    newHtml("explain", "exit.html")
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false);