PennController.ResetPrefix(null) // Removes PennController prefixes, kkep this here
// DebugOff(); // Uncomment this line when you are ready to collect actual data to disable debug mode.

Header(
   // void
)
.log("PROLIFIC_ID", GetURLParameter("id") )

// IMPORTANT NOTE: when running this project, the eye-tracker will highlight
// the element that it estimates the participant is looking at
// Edit the file PennController.css in the Aesthetics folder to remove highlighting

// NOTE: this template will not *actually* collect eye-tracking data,
//       because the command EyeTrackerURL below points to a dummy URL in the

// Resources are hosted as ZIP files on a distant server
PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/Pictures.zip")
// PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioContext.zip")
// PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioTest.zip")

// If uploading data to a distant server, uncomment the line below and replace the URL
// with one that points to a PHP script that you uploaded to your webserver
// (see https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data.html#php-script)
EyeTrackerURL("https://mondo1.dreamhosters.com/script.php")

// ***

// Sequence("consent","participant_ID","setcounter","introduction","introduction2","practice1","practice2","pract2attention","practice3","pract3attention",
//         "start_experiment",rshuffle("exp1-fema", "exp1-femb","exp1-masa","exp1-masb","exp1-attentiona","exp1-attentionb"),"break", 
//         rshuffle("exp2-fema", "exp2-femb","exp2-masa","exp2-masb","exp2-attentiona","exp2-attentionb"),
//         "audioconfirm","posttest1","posttest1_gender1","posttest2","posttest2_gender2","posttest3","posttest3_gender3","posttest4","posttest4_gender4","Final-Q",SendResults(), "survey", "end");
        
// // Define the sequence of the experiment blocks
Sequence("start", randomize("experiment_trial"), "send_results", "thank_you");
// "welcome", "calibration", "check_preloaded", "participant_data", "instructions", "practice", 

// Welcome page
newTrial("welcome",
    defaultText
        // .css("width", "80%") // Make text block readable
        // .css("margin", "auto") // Center the text block
        // .css("font-size", "100%") // Font size
        .center()
        .print()
        ,
    newText("welcome", "<p>Welcome!</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText(  
        "<p>This experiment is part of a project supervised by Dr. Yu-Yin Hsu of The Hong Kong Polytechnic University.</p>" +
        "<p>In this online experiment, you will read sentences in Hungarian and make some simple decisions. You will see detailed instructions later.</p>" +
        "<p>You can take part in the experment ONLY if you are using use a <b>computer</b> with a <b>physical keyboard</b>, and a <b>webcam</b>. <br>You should start the experiment ONLY if you have the time to <b>complete it</b> and with <b>no rush</b>; it is <b>not possible</b> to save the current session. <br><u>If you <b>close the browser window</b>, you will have to <b>start over</b></u>. Firefox and Chrome are recommended. </p>" +
        "<p>The study will take approximately <b>30 minutes</b> to complete; on the next screens we will walk you though calbiration, instructions, and conduct a practice round. </p>" +
        "<p>Please pay attention and respond as quickly and accurately as possible!</p>" +
        "<p>If you have any questions, you can contact us at: gabor.parti@connect.polyu.hk</p>"
        )
        .center()
        .print()
        ,
    // newText("question","<p>If you have any questions, feel free to contact us at:"),
    // newText("email", "gabor.parti@connect.polyu.hk</p>").color("blue"),
    
    newText("<p>If you agree to take part in this study, you consent that the following data will be collected: demographic data, reading times, eye movement within this window and the choices you made during the trials. These information will be stored anonymously and will only be used for scientific purposes.</p>")
        .cssContainer("width", "80%")
        .cssContainer("border", "solid 2px blue")
        .cssContainer("padding-left", "10px")
        ,
    // newText("<p>If you wish to participate, please select 'I consent to [...]' below. </p>")
    //     .center()
    //     .print()
    // ,
    // newScale(" I consent to the collection of my data and I wish to participate in the experiment.")
    //     .labelsPosition("center")
    //     .vertical()
    //     .css("font-size", "100%")
    //     .center()
    //     .print()
    // ,
    
    newHtml("consent_form", `<p><input type="checkbox" class="obligatory"> I have read the above, I consent to the collection of my data, and I wish to participate in the experiment.</p>`)
        // .cssContainer({"margin":"1em"})
        // .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .center()
        .print()
        .log()
        ,

    newButton("continue_button", "Continue")
        .center()
        .print()
        // .wait(getScale("consent").test.selected())
        .wait(getHtml("consent_form")
        .test.complete()
        .failure(getHtml("consent_form").warn()
        // .css('margin-bottom','20px'),
        )
        ),
    
    fullscreen()
);



// Calibration page; we do a first calibration here---meanwhile, the resources are preloading
newTrial("calibration",
    defaultText
        .center()
        .print()
        ,
    newText("calibration_title", "<p>Calibration</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
            <p>We only collect data on where on this page your eyes are looking during the experiment.</p>`)
        .center()
        .print()
        ,
    newButton("I understand, start the calibration", "I understand, start the calibration")
        .center()
        .print()
        .wait(newEyeTracker("tracker").test.ready())
        .remove()
        ,
    clear(),
    fullscreen(),
    
    // Start calibrating the eye-tracker, allow for up to 2 attempts
    // 50 means that calibration succeeds when 50% of the estimates match the click coordinates
    // Increase the threshold for better accuracy, but more risks of losing participants
    getEyeTracker("tracker").calibrate(60,2)
    ,
    newText(`<p>You will see the same button in the middle of the screen before each trial.</p>
             <p>Fixate on it for 3 seconds to check that the tracker is still well calibrated.</p>
             <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
        .center()
        .print()
    ,
    newButton("Continue")
        .center()
        .print()
        .wait()
);



// Check preloaded
newTrial("check_preloaded",
    // Wait if the resources have not finished preloading by the time the tracker is calibrated
    CheckPreloaded(),
    newText("Loading experiment data...")
        .center()
        .print()
        ,
        
    newTimer("1000", 1000).start().wait(),
    ),
    


// Participant data
newTrial("participant_data",
    defaultText
        .print()
        .center(),
    
    newText("newline", "<p>...</p>").hidden(),
        
    newText("welcome", "<p>Participant information</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText("<p>Enter your <b>Prolific ID</b>:</p>")
        .center()
        .print()
    ,
    
    newText("<p>Fill in the field and press ENTER (↵).</p>")
        .center()
        .print()
    ,
    
    newTextInput("input_participant_id")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_participant_id").testNot.text("") )
    ,

    getText("newline").hidden(),
    
    newText("<p>Notice: Before payment, we will check the validity of the recorded data.</p>")
        .css("font-size", "110%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    newButton("Continue")
        .print()
        .center()
        .wait(getTextInput("input_participant_id").testNot.text(""))
    ,
    newVar("participant")
        .global()
        .set( getTextInput("input_participant_id") )
    ,
)
    .log("participant" , getVar("participant") )


    
// Instructions
newTrial("instructions",
    defaultText
        .center()
        .print()
        ,
    
    newText("instruction_title", "<p>Instructions</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
        
    newText("<p>In this experiment, you will read Hungarian sentences.</p>" + 
    "<p>Before each sentence, you will see an image pair that gives you some context.</p>" + 
    "<p>Before each sentence, you will see a fixation cross (+) in the center of the screen. </p>" + 
    "<p>You will not see the full sentences, but <b>one word at a time</b>.</p>" + 
    "<p>Use the <b>space bar</b> (␣) to move to the next word, which will be shown in the center of your screen.</p>" + 
    "<p>Make sure you understand the word on the screen before pressing the space bar and moving to the next one.</p>" + 
    "<p>After each sentence, you will see <b>two images</b> on the left and right side of the screen.</p>" + 
    "<p>Your task is to <b>choose</b> the image that best fits the sentence you read.</p>" + 
    "<p>You must <b>click</b> on an image to make a selection and move on to the next item.</p>"
    ),
    
    newText("newline", "<p>...</p>").hidden(),
    
    newText("Try to respond as quckly and accurately as you can!")
        .css("font-size", "120%")
        .print(),
    
    getText("newline").hidden(),
        
    newText("space", "__________"),
    newText("<p> (Press the space bar to continue) </p>"),
    newKey("space", " ").wait()
);



// Practice
Template("practice.csv", row => 
    newTrial("practice",
        defaultText
        .center()
        .print(),
    
    // Check/recalibrate the tracker before every trial  ////////
    newEyeTracker("tracker").calibrate(60,2),            ////////
    
    // Text
    newText("practice_text", "PRACTICE ROUND " + row.item + "/3")
        .css("font-size", "150%")
        .center()
        .print(),
    
    // Show image pair
    newCanvas("left_canvas_practice", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("left_image", row.image_left + ".png" || row.image_left + ".jpg").size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas_practice", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("right_image", row.image_right + ".png" || row.image_right + ".jpg").size("90%", "90%"))
        .print("center at 77.5vw", "middle at 50vh"),

    // Delay
    newTimer("1000", 1000).start().wait(),

    newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newKey(" ").wait(),
    getText("spacebar").remove(),
    getCanvas("left_canvas_practice").remove(),
    getCanvas("right_canvas_practice").remove(),
    
    // Fixation
    newText("fixation_cross", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross").remove(),
    
    //Show regions
    newText("vspace", "").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r0", " ").log().wait(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r1", " ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r2", " ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r3", " ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r4", " ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r5", " ").log().wait(),
    getText("r5").remove(),
    
    newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r6", " ").log().wait(),
    getText("r6").remove(),
    
    newText("r7", row.r7).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r7", " ").log().wait(),
    getText("r7").remove(),
    
    // getText("practice_text").remove()
    // ,
    
    // Show images (images are placed on canvases, which serve as clickable regions)
    getCanvas("left_canvas_practice", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", getImage("left_image", row.image_left + ".png" || row.image_left + ".jpg").size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    getCanvas("right_canvas_practice", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", getImage("right_image", row.image_right + ".png" || row.image_right + ".jpg").size("90%", "90%"))
        .print("center at 77.5vw", "middle at 50vh"),

        // Activate tracker
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("left_canvas_practice"),
                getCanvas("right_canvas_practice"),
                )
                .log()  // If this line is missing, the eye-tracking data won't be sent to the server
                .start(),

        // // Delay
        // newTimer("500", 500).start().wait(),
        getTimer("1000").start().wait(),
        
        // Collect participant's choice by clicking on one of the images
        newSelector("choice_selector")
            .add(
                getCanvas("left_canvas_practice"), 
                getCanvas("right_canvas_practice")) // Define clickable elements
            .once() // Participant can only click once
            .log() // Log which element was selected (its ID) and the reaction time //"all"?
            .wait(), // Wait for a selection (click)
        
        // Stop tracker to prevent collecting unnecessary data
        getEyeTracker("tracker").stop(),
        
        // Wait before next round
        getTimer("1000").start().wait(),
    )
//     // Log additional trial information from the CSV file to the results
    // .log("item_number", row.item_number)
    // .log("condition", row.condition)
    // .log("audio_file", row.audio_file)
    // .log("image_left", row.image_left)
    // .log("image_right", row.image_right)
    // .log("expected_choice_image", row.expected_choice_image)

    // .log("group", row.group)
    // .log("item", row.item)
    // .log("condition", row.inflection)
    // .log("ID", getVar("ID"))
    
//     // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
//     // .log( "participant_id" , PennController.GetURLParameter("id") )
);


    
// Start message
newTrial("start",
    defaultText
        .center()
        .print()
    ,
    newText("<p>That's it, now we move on to the real experiment.</p>")
        .center()
        .print("center at 50vw", "middle at 25vh"),
    
    newText("<p>Live trials will start now! </p>")
        .css("font-size", "300%") // Font size
        .center()
        .print("center at 50vw", "middle at 50vh")
    ,
    newButton("Continue")
        .center()
        .print("center at 50vw", "middle at 75vh")
        .wait()
);



// // Real Experiment 
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",
// Grouping
// newTrial( "exp1-"+row.cond+row.group,



// Experiment
Template("experiment_data.csv", row => 
    newTrial("experiment_trial",
        defaultText
        .center()
        .print(),
    
    // Check/recalibrate the tracker before every trial  ////////
    newEyeTracker("tracker").calibrate(60,2),            ////////
    
    // Show image pair
    newCanvas("left_canvas", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("left_image", row.image_left + ".png" || row.image_left + ".jpg").size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("right_image", row.image_right + ".png" || row.image_right + ".jpg").size("90%", "90%"))
        .print("center at 77.5vw", "middle at 50vh"),

    newTimer("1000", 1000).start().wait(),

    newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newKey(" ").wait(),
    getText("spacebar").remove(),
    getCanvas("left_canvas").remove(),
    getCanvas("right_canvas").remove(),
    
    // Fixation
    newText("fixation_cross", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross").remove(),
    
    //Show regions
    newText("vspace", "").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r0", " ").log().wait(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r1", " ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r2", " ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r3", " ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r4", " ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r5", " ").log().wait(),
    getText("r5").remove(),
    
    newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey("r6", " ").log().wait(),
    getText("r6").remove(),
    
    // newText("r6", row.r6)
    // .testNot.text("")
    // .success(
    //     getText("r6").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    //     newKey("r6", " ").log().wait(),
    //     getText("r6").remove()
    // ),
    
    // (row.r7!='none'? 
    // [
    //     newText("r7",row.r7).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    //     newKey("r7", " ").log().wait(),
    //     getText("r7").remove()
    // ]
    // :
    // []
    // ),
    
    newText("r7", row.r7)
    .testNot.text("")
    .success(
        getText("r7").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
        newKey("r7", " ").log().wait(),
        getText("r7").remove()
    ),
    
    //
    newTimer("500", 500).start().wait(),
    
    // Test if the 'question' field is not empty
    (row.question.trim() !== "" ?
        newText("questionText", row.question)
            .css("font-size", "150%")
            .css("max-width", "20vw")
            .css("overflow-wrap", "break-word")
            .css("text-align", "center")
            .print("center at 50vw", "middle at 50vh")
            .log()
            .after(getTimer("500").start().wait())
      :
      null
    ),
    newKey("question_read", " ").log().wait(),

    
    
    // Show images (images are placed on canvases, which serve as clickable regions)
    getCanvas("left_canvas", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", getImage("left_image", row.image_left + ".png" || row.image_left + ".jpg").size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    getCanvas("right_canvas", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", getImage("right_image", row.image_right + ".png" || row.image_right + ".jpg").size("90%", "90%"))
        .print("center at 77.5vw", "middle at 50vh"),

        // Activate tracker
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("left_canvas"),
                getCanvas("right_canvas"),
                )
                .log()  // If this line is missing, the eye-tracking data won't be sent to the server
                .start(),

        // // Delay
        // newTimer("500", 500).start().wait(),
        getTimer("1000").start().wait(),
        
        // Collect participant's choice by clicking on one of the images
        newSelector("choice_selector")
            .add(
                getCanvas("left_canvas"), 
                getCanvas("right_canvas")) // Define clickable elements
            // .shuffle() // Always shuffles and also adds a delay, hardcode it instead!
            .once() // Participant can only click once
            .log() // Log which element was selected (its ID) and the reaction time //"all"?
            .wait(), // Wait for a selection (click)
        
        // Stop tracker to prevent collecting unnecessary data
        getEyeTracker("tracker").stop(),
        
        // Wait before next round
        getTimer("1000").start().wait(),
    )
    // Log additional trial information from the CSV file to the results
    // .log("item", row.item_number)
    // .log("condition", row.condition)
    // .log("image_left", row.image_left)
    // .log("image_right", row.image_right)
    // .log("expected_choice", row.expected_choice)

    // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
    // .log( "participant_id" , PennController.GetURLParameter("id") )
);



// Send results to the server
newTrial("send_results",
    defaultText
        .center()
        .print(),

    // The SendResults command will try to send data to the server.
    // This is handled by PCIbex farm's infrastructure or your own backend if self-hosting.
    SendResults(), // This command handles sending all collected data.
    
    newText("sending_results_text", "Please wait while we save your responses...").center().print(),
    newTimer("wait_after_send", 1000).start().wait(), // Brief pause to ensure data sending process initiates
    getText("sending_results_text").text("Your responses have been saved.").center().print(), // Update text
    getTimer("wait_after_send", 1000).start().wait(), // Brief pause to ensure data sending process completes
    newText("newline", "<p>...</p>").hidden(),
    newButton("Done.").center().print().wait(),
    
    exitFullscreen(),
)

// Thank you screen and end of the experiment
newTrial( "thank_you",
    defaultText
    .center()
    .print(),
    
    newText("thank_you_text", "<p>This is the end of the experiment, thank you for your participation!</p>").print(),
    newText("close_text", "<p>You can now close this window.</p>").print(),
    
    // This button is not printed but keeps the page open until the participant closes it.
    newButton("finish_button").wait(),
)

// .setOption("countsForProgressBar", false); // This trial does not count towards the progress bar.
