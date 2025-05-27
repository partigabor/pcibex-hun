PennController.ResetPrefix(null) // Shorten command names (keep this line here);

PennController.DebugOff() // ADD THIS ONE ONLY WHEN YOU SEND YOUR EXERIMENT TO PARTICIPANTS

// Greetings
newTrial("Greetings" ,
    defaultText
        .print()
        .center()
    ,
    newText("1","<p>Welcome to this experiment about reading behavior! <br>The project is supervised by Dr. Yu-Yin Hsu of The Hong Kong Polytechnic University.</p>")
        .center()
        .print()
        ,
    newText("2","<p>You have been invited to participate in this study because you are a native Hunagrian speaker.</p>")
     ,
    newText("3","<p>This online study will take approximately <strong>30 minutes</strong>. <br>For your help, you will receive a compensation of <strong>8 USD</strong>. <br>Please note that the payment is not immediate, but it will be approved after a quality-check of the data you submit.")
    ,
    newText("4","<p>If you agree to take part in this study, your information (demographic data, reading times, and questionnaire answers) will be kept confidential, anonimous, and used for scientific purposes only.</p>")
        .cssContainer("border", "solid 1px red")
        .cssContainer("padding-left", "10px")
    ,
    newText("5","<p>You can take part in the experment ONLY if you use a <strong>computer</strong> with an <strong>internet</strong> connection, and a <strong>physical keyboard</strong>. <br>Finally, we invite you to start the experiment only if you have the time to complete it <u>entirely</u> and with <u>no rush</u>, because it is NOT possible to save the current session. <br>Thus, if you <strong>close</strong> the <strong>browser</strong> window, you will have to <strong>start the experiment over</strong>.</p>")
    ,
    newText("6","<p>If you have any questions about the study we are working on, feel free to contact us:")
    , 
    newText("7", "gabor.parti@connect.polyu.hk</p>")
        .color("dodgerblue")
        //.before(getText("6"))
    ,
    newText("8", ".")
        //.before(getText("7"))
    ,
    newText("9","<p>If you agree to your data collection, and you wish to participate, select 'I Agree to [...]':</p>")
    ,
    newScale("consent", "I Agree to the collection of my data and I wish to participate")
        .labelsPosition("center")
        .vertical()
        .center()
        .print()
        //.wait()
    ,
    newText("10","<p>If you changed your mind and you do not wish to participate in the study anymore, close the browser window.</p>")
    ,
    newButton("Send")
        .print()
        .center()
        .wait( getScale("consent").test.selected() )
        .css('margin-bottom','20px')
    ,
    // newButton("No","<strong>non desidero partecipare allo studio</strong>")
    //     .css("background", "tomato")
    //     .css("font-size", "150%")
    //     .center()
    //     .italic()
    //     .callback( getText("1").remove(), getText("2").remove(), getText("3").remove(), getText("4").remove(), getText("7").remove(), 
    //               getText("8").remove(), getText("5").remove(), getButton("No").remove(), getButton("Yes").remove(), 
    //               newText("close the tab", "Puoi abbandonare l'esperimento.") .print().css("font-size", "170%"), 
    //               newText("&#9757") .print().before(getText("close the tab")).css("font-size", "170%"), newText("nnn").print().hidden().css("font-size","10%"), 
    //               newText("&#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045; &#10045;")
    //               .css("font-size", "50%") )
    //     .print()
    // ,
    // newText("<p>  </p>")
    // ,
    // newButton("Yes","<strong>sì, desidero partecipare allo studio</strong>")
    //     .css("background", "mediumseagreen")
    //     .css("font-size", "150%")
    //     .center()
    //     .italic()
    //     .print()
    //     .wait()
)


///////////////////////////////////Contacts
newTrial("Contacts",
    defaultText
        .print()
        .center()
    ,
    newText("<p>Contact and payment information.</p>")
        .css("font-size", "150%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    newText("<p>Press <strong>Enter</strong> after filling EACH field.</p>")
    .css("font-size", "120%")
    .center()
    .print()
    ,
    newText("<p>Enter e-mail address.</p>")
        .css("font-size", "120%")
        .center()
        .print()
    ,
    newTextInput("input_email")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_email").testNot.text("") )
    ,
    newText("<p>Enter PayPal contact to receive the compensation.</p>")
        .css("font-size", "120%")
        .center()
        .print()
    ,
    newTextInput("input_paypal")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_paypal").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Notice: Before proceeding to payment, a preliminary check of the validity of the data sent will be necessary.</p>")
        .css("font-size", "130%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    newButton("Send")
        .print()
        .center()
        .wait(getTextInput("input_paypal").testNot.text(""))
    ,
    newVar("Email")
        .global()
        .set( getTextInput("input_email") )
    ,
    newVar("PayPal")
        .global()
        .set( getTextInput("input_paypal") )

)
    .log( "Email" , getVar("Email") )
    .log( "PayPal" , getVar("PayPal") )



// GeneralInfo
newTrial("Demographic",
    defaultText
        .print()
        .center()
    ,
    newText("<p>General information. <br>Please follow the suggested format or options.</p>")
        .css("font-size", "150%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    newText("<p>Press <strong>enter</strong> after answering EACH question.</p>")
    .css("font-size", "120%")
    .center()
    .print()
    ,
    newText("<p>Year of birth (format: YYYY)</p>")
        .css("font-size", "120%")
        .center()
        .print()
    ,
    newTextInput("input_year")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_year").test.text(/\d{4}/) )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Gender (options: M/F/other)</p>")
        .css("font-size", "130%")
        .center()
        .print()
    ,
    newTextInput("input_gender")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_gender").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Dominant hand (options: R/L)</p>")
        .css("font-size", "130%")
        .center()
        .print()
    ,
    newTextInput("input_hand")
        .log()
        .center()
        .print()
        .css('margin-bottom','20px')
        .lines(1)
        .wait( getTextInput("input_hand").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Level of education")
        .css("font-size", "130%")
        .center()
        .print()
    ,
    newText("(options: elementary/middle/high school/bachelor's/master's/doctorate)</p>")
        .css("font-size", "130%")
        .center()
        .print()
    ,
    newTextInput("input_education")
        .log()
        .css('margin-bottom','20px')
        .center()
        .print()
        .lines(1)
        .wait( getTextInput("input_education").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>If you have completed university studies, specify the faculty. Otherwise enter 'NA'</p>")
    .css("font-size", "130%")
    .css("text-align", "center")
    .center()
    .print()
    ,
    newTextInput("input_major")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_major").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Do you speak a regional dialect or vernacular fluently? If yes, specify which one/s, separating with a comma, otherwise enter 'NA'</p>")
    .css("font-size", "130%")
    .css("text-align", "center")
    .center()
    .print()
    ,
    newTextInput("input_dialect")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_dialect").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>City of birth (or where you lived for the first 7 years of life)</p>")
    .css("font-size", "130%")
    .center()
    .print()
    ,
    newTextInput("input_city")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
        .wait( getTextInput("input_city").testNot.text("") )

    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Known foreign languages <br>(format: 'language (level)', separate languages with a comma)</p>")
    .css("font-size", "130%")
    .css("text-align", "center")
    .center()
    .print()
    ,
    newTextInput("input_foreign_lang")
        .log()
        .center()
        .print()
        .css('margin-bottom','20px')
        .lines(1)
        .wait( getTextInput("input_foreign_lang").testNot.text("") )
    ,
    newText("nnn")
        .hidden()
        .print()
    ,
    newText("<p>Number of books read per year, on average (any genre)</p>")
    .css("font-size", "130%")
    .center()
    .print()
    ,
    newTextInput("input_books")
        .log()
        .css('margin-bottom','20px')
        .center()
        .print()
        .lines(1)
        .wait( getTextInput("input_books").testNot.text("") )
    ,
    newText("    ")
        .print()
    ,
    newButton("Send")
        .print()
        .center()
        .css('margin-bottom','20px')
        .wait(getTextInput("input_books").testNot.text(""))
    ,
    // newButton("Invia")
    //     .print()
    //     .center()
    //     .wait()
    //     //.wait(getTextInput("input_year").testNot.text("")&getTextInput("input_gender").testNot.text(""))
    //     //.wait(getTextInput("input_year").testNot.text(""))
    //     //.wait(getTextInput("input_gender").testNot.text(""))
    //     //.wait(getTextInput("input_hand").testNot.text(""))
    //     //.wait(getTextInput("input_education").testNot.text(""))
    //     //.wait(getTextInput("input_major").testNot.text(""))
    //     // .wait(getTextInput("input_dialect").testNot.text(""))
    //     // .wait(getTextInput("input_city").testNot.text(""))
    //     // .wait(getTextInput("input_foreign_lang").testNot.text(""))
    //     // .wait(getTextInput("input_books").testNot.text(""))
    // ,
    newVar("Year")
        .global()
        .set( getTextInput("input_year") )
    ,
    newVar("Gender")
        .global()
        .set( getTextInput("input_gender") )
    ,
    newVar("Hand")
        .global()
        .set( getTextInput("input_hand") )
    ,
    newVar("Education")
        .global()
        .set( getTextInput("input_education") )
    ,
    newVar("Major")
        .global()
        .set( getTextInput("input_major") )
    ,
    newVar("Dialect")
        .global()
        .set( getTextInput("input_dialect") )
    ,
    newVar("City")
        .global()
        .set( getTextInput("input_city") )
    ,
    newVar("Languages")
        .global()
        .set( getTextInput("input_foreign_lang") )
    ,
    newVar("Books")
        .global()
        .set( getTextInput("input_books") )
        
)

    .log( "Year" , getVar("Year") )
    .log( "Gender" , getVar("Gender") )
    .log( "Hand" , getVar("Hand") )
    .log( "Education" , getVar("Education") )
    .log( "Major" , getVar("Major") )
    .log( "Dialect" , getVar("Dialect") )
    .log( "City" , getVar("City") )
    .log( "Email" , getVar("Email") )
    .log( "Books" , getVar("Books") )



// Instruction part 1 
newTrial("Instruction part 1",
    defaultText
        .print()
        .center()
    ,
    newText("<p>In each section, you will find <strong>one or two</strong> sentences in English to read.</p>")
    ,
    newText("<p>Before each sentence, you will see a cross in the center of the screen <strong>(+)</strong> </p>")
    ,
    newText("<p><p>You will not see the full sentences, but one word at a time.</p>")
        .css('font-size','110%')
    ,
    newText("<p>Use the space bar to move to the next word, which will be shown in the center of your screen.</p>")
    ,
    newText("<p>Make sure you understand the word on the screen before pressing the space bar and moving to the next one.</p>")
    ,
    
    newText("<p>nnn</p>")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()

)

newTrial("Instruction part 2",
    defaultText
        .print()
        .center()
    ,
    newText("<p>When there are two sentences, make sure you understand Sentence A <br>before starting with Sentence B.</p>")
    ,
    newText("<p>After each sentence / pair, there will be a question regarding the short text just read.</p>")
    ,
    newText("<p>When there are two sentences in a row (Sentence A and Sentence B), the question will be about the connection between the two sentences.</p>")
    ,
    newText("<p>When there is only one sentence (Single Sentence), the question will be about the structure of that sentence.</p>")
    ,
    newText("<p>nnn</p>")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()

)

// Instruction part 3
newTrial("Instruction part 3",
    defaultText
        .print()
        .center()
    ,
    newText("<p>When there are two sentences, you will be asked to express a judgment regarding the plausibility of Sentence B as an interpretation of Sentence A:</p>")
    ,
    newText("<p><strong>“How plausible is it that Sentence B is the interpretation of Sentence A?” </strong></p>")
    ,
    newText("<p>Select a number from 1 to 7 as your answer.</p>")
    ,
    newText("<p>Respond quickly based on your instinct, without overthinking it.</p>")
    ,
    newText("<p>For <strong>example</strong>:</p>")
    ,
    newText("<p><strong>1</strong> = absolutely <strong>implausible </strong><br><strong>3</strong> = a bit <strong>odd </strong><br><strong>5</strong> = <strong>acceptable</strong>, probably plausible<br><strong>7</strong> = absolutely <strong>plausible</strong></p>")
    // ,
    // newText("<p><strong>3</strong> = un po' <strong>strana </strong></p>")
    // ,
    // newText("<p><strong>5</strong> = <strong>accettabile</strong>, probabilmente plausibile</p>")
    // ,
    // newText("<p><strong>7</strong> = assolutamente <strong>plausibile</strong></p>")
    ,
    newText("<p>nnn</p>")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()

)

newTrial("Instruction part 3",
    defaultText
        .print()
        .center()
    ,
    newText("<p>When there is only one sentence, you will be asked to express a judgment regarding the structure of that sentence:</p>")
    ,
    newText("<p><strong>“How natural does the structure of this sentence seem to you?” </strong></p>")
    ,
    newText("<p>Select a number from 1 to 7 as your answer.</p>")
    ,
    newText("<p>Respond quickly based on your instinct, without overthinking it.</p>")
    ,
    newText("<p>For <strong>example</strong>:</p>")
    ,
    newText("<p><strong>1</strong> = absolutely <strong>unnatural </strong><br><strong>3</strong> = a bit <strong>odd </strong><br><strong>5</strong> = <strong>acceptable</strong>, probably natural<br><strong>7</strong> = absolutely <strong>natural</strong></p>")
    // ,
    // newText("<p><strong>3</strong> = un po' <strong>strana </strong></p>")
    // ,
    // newText("<p><strong>5</strong> = <strong>accettabile</strong>, probabilmente plausibile</p>")
    // ,
    // newText("<p><strong>7</strong> = assolutamente <strong>plausibile</strong></p>")
    ,
    newText("<p>nnn</p>")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()

)


// Instruction part 5
newTrial("Instruction part 5",
    defaultText
        .print()
        .center()
    ,
    newText("<p>Position yourself comfortably in front of the screen.</p>")
    ,
    newText("<p>Before starting, there will be some practice sentences followed by the actual experiment.</p>")
    ,
    newText("<p>Prepare your hand with fingers on the numbers and thumb on the space bar.</p>")
    ,
    newText("<p>nnn</p>")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()
)

    
    
// Inform about the beginning of practice trials
// newTrial("Inizio dell'esercitazione",
//     defaultText
//         .print()
//         .center()
//     ,
//     newText("<p>Ora vedrai alcune frasi di esercitazione.</p>")
//     ,
//     // newText("<p>Se rispondi correttamente, potrai passare alla frase successiva. Altrimenti, vedrai il messaggio </p>")
//     // ,
//     // newText("0","<p>Se la tua risposta è errata, vedrai il seguente messaggio: ")
//     // , 
//     // newText("00", "nn")
//     //     .hidden()
//     //     .before(getText("0"))
//     // , 
//     // newText("<strong> “Risposta sbagliata! Per favore, leggi la breve storia con più attenzione!</strong> </p>")
//     //     .before(getText("00"))
//     //     .color("red")
//     //     .css("font-size", "120%")
//     //     ,
//     newText("0", "<p></p>"),
//     // ,
//     newText("53", "")
//         .before(getText("52"))
//         .css("background-color", "Aqua")
//         .css("font-size", "130%")
//         .bold()
//     ,
//     newText("54", "Prepara il pollice sulla barra spaziatrice e le altre dita sui numeri.")
//         .before(getText("53"))
//     ,
//     newText("<p>nnn</p>")
//         .hidden()
//     ,
//     newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
//     ,
//     newText("<p> (Premi la barra spaziatrice per continuare) </p>")
//         .css("font-size", "80%")
//     ,
//     newKey(" ")
//         .wait()
// )
////////////// FINE INFO


/////// PracticeTrial 01
Template("practice.csv",row => 
newTrial("PracticeTrial 01",
    newTimer(500)
    .center()
    .start()
    .wait()
    ,
(row.second_Region1=='none' ?
        newText("sentA","Single Sentence:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
        
        :newText("sentA","Sentence A:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
    ),
    
    newText("spacebar","<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
        .center()
        .print()
        ,
    newKey(" ")
        .wait()
        ,    
    getText("spacebar")
        .remove()
    ,
    newText("cross", "+")
    .center()
    .css("font-size", "250%")
    .print()
    ,
    newTimer(1500)
        .start()
        .wait()
    ,
    getText("cross")
        .remove()
    , 
    newText("first_Region1", row.first_Region1)
        .center()
        .css("font-size", "250%")
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region1")
        .remove()
    ,
    newText("first_Region2",row.first_Region2)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region2")
        .remove()
    ,
    newText("first_Region3", row.first_Region3)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region3")
        .remove()
    ,
    newText("first_Region4",row.first_Region4)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region4")
        .remove()
    ,
    newText("first_Region5", row.first_Region5)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region5")
        .remove()
    ,
    newText("first_Region6", row.first_Region6)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region6")
        .remove()
    , 
    (row.first_Region7!="none" ? [
        newText("first_Region7", row.first_Region7)
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region7")
            .remove()
        ] : newText("<p>nnn</p >")
            .hidden()
    ),
    
    (row.first_Region8!='none'? [
        newText("first_Region8",row.first_Region8)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region8")
            .remove()
        ]: newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.first_Region9!='none' ? [
        newText("first_Region9", row.first_Region9)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region9")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.second_Region1!='none' ? [
        getText("sentA")
            .remove()
        ,
        newText("sentB","Sentence B:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
        ,
        newText("spacebar2","<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
        .center()
        .print()
        ,
        newKey(" ")
            .wait()
            ,
        getText("spacebar2")
            .remove()
        ,    
        newText("cross2", "+")
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newTimer(1500)
            .start()
            .wait()
        ,
        getText("cross2")
            .remove()
        , 
        newText("second_Region1", row.second_Region1)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region1")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region2!='none' ? [
        newText("second_Region2", row.second_Region2)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region2")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region3!='none' ? [
        newText("second_Region3", row.second_Region3)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region3")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region4!='none' ? [
        newText("second_Region4", row.second_Region4)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region4")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region5!='none' ? [
        newText("second_Region5", row.second_Region5)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region5")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region6!='none' ? [
        newText("second_Region6", row.second_Region6)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region6")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ), 
    (row.second_Region7!="none" ? [
        newText("second_Region7", row.second_Region7)
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region7")
            .remove()
        ] : newText("<p>nnn</p >")
            .hidden()
    ),
    
    (row.second_Region8!='none'? [
        newText("second_Region8",row.second_Region8)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region8")
            .remove()
        ]: newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.second_Region9!='none' ? [
        newText("second_Region9", row.second_Region9)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region9")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    
    (row.second_Region1 != 'none'?[
        getText("sentB")
            .remove()
        ,
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    
    
    newText("<strong>Question</strong>", row.Question)
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
    ,
    newText("Express a judgment from 1 to 7 (1, 2, 3, 4, 5, 6, or 7) <br>For <strong>example</strong>:")
        .css("font-size", "130%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    // newText("<p><strong>1</strong> = assolutamente <strong>improbabile </strong><br><strong>3</strong> = un po' <strong>strana </strong><br><strong>5</strong> = <strong>comprensibile</strong>, probabilmente naturale<br><strong>7</strong> = assolutamente <strong>naturale</strong></p>")
    // ,
    newText("Instruction1",row.Instruction1)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction2",row.Instruction2)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction3",row.Instruction3)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction4",row.Instruction4)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction5",row.Instruction5)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction6",row.Instruction6)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction7",row.Instruction7)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newKey("1,2,3,4,5,6,7")
        .log()
        .wait()
)
  .log( "Email" , getVar("Email") )
  .log( "practice_n"   , "row.item_ID"  )
  .log( "ItemType"      , "PracticeTrial"     )
//   .log( "CorrectAnswer" , "4,5,6,7"              )
)  


// Inform the beginning of the experiment
newTrial("the beginning of the experiment",
    defaultText
        .print()
        .center()
    ,
    newText("<p>Practice completed.</p>")
    ,
    newText("<p>Remember that you can use any number from 1 to 7 to express the naturalness/plausibility of the sentence.</p>")
    ,
    newText("22", "<p>Position your hand on the keyboard.</p>")
    //newText("<p>Posiziona la mano sulla tastiera.</p >")
    ,
    newText("23", "1-7")
        .before(getText("22"))
        .css("background-color", "Aqua")
        .css("font-size", "130%")
        .bold()
    ,
    //newText("24", "per votare.")
    newText("24", "")
        .before(getText("23"))
    ,
    newText("71", "<p>Use your thumb to control</p>")
      ,
    newText("72", "the space bar")
        .before(getText("71"))
        .css("background-color", "Chartreuse")
        .bold()
    ,
    //newText("73", "e continuare la lettura.")
    newText("73", "")
        .before(getText("72"))
    ,
    newText("<p>Please stay focused during reading!</p>")
        .css("color", "OrangeRed ")
        .css("font-size", "120%")
        .bold()
    ,
    newText("<p>The experiment begins now.</p >")
        .css("color", "LimeGreen")
        .css("font-size", "150%")
        .bold()
    ,
    newText("<p>nnn</p >")
        .hidden()
    ,
    newText("&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;&#9476;")
    ,
    newText("<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
    ,
    newKey(" ")
        .wait()
)


/// Experimental part       
//Template("RT_ratings_ENG2.csv",row => 
Template("prova.csv",row => 
newTrial("Experimental part",
    newTimer(700)
    .start()
    .wait()
    ,
    (row.second_Region1=='none' ?
        newText("sentA","Single Sentence:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
        
        :newText("sentA","Sentence A:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
    ),
    
    newText("spacebar","<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
        .center()
        .print()
        ,
    newKey(" ")
        .wait()
        ,    
    getText("spacebar")
        .remove()
    ,
    newText("cross", "+")
    .center()
    .css("font-size", "250%")
    .print()
    ,
    newTimer(1500)
        .start()
        .wait()
    ,
    getText("cross")
        .remove()
    , 
    newText("first_Region1", row.first_Region1)
        .center()
        .css("font-size", "250%")
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region1")
        .remove()
    ,
    newText("first_Region2",row.first_Region2)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region2")
        .remove()
    ,
    newText("first_Region3", row.first_Region3)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region3")
        .remove()
    ,
    newText("first_Region4",row.first_Region4)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region4")
        .remove()
    ,
    newText("first_Region5", row.first_Region5)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region5")
        .remove()
    ,
    newText("first_Region6", row.first_Region6)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("first_Region6")
        .remove()
    , 
    (row.first_Region7!="none" ? [
        newText("first_Region7", row.first_Region7)
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region7")
            .remove()
        ] : newText("<p>nnn</p >")
            .hidden()
    ),
    
    (row.first_Region8!='none'? [
        newText("first_Region8",row.first_Region8)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region8")
            .remove()
        ]: newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.first_Region9!='none' ? [
        newText("first_Region9", row.first_Region9)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("first_Region9")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.second_Region1!='none' ? [
        getText("sentA")
            .remove()
        ,
        newText("sentB","Sentence B:")
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
        ,
        newText("spacebar2","<p> (Press the space bar to continue) </p>")
        .css("font-size", "80%")
        .center()
        .print()
        ,
        newKey(" ")
            .wait()
            ,
        getText("spacebar2")
            .remove()
        ,    
        newText("cross2", "+")
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newTimer(1500)
            .start()
            .wait()
        ,
        getText("cross2")
            .remove()
        , 
        newText("second_Region1", row.second_Region1)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region1")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region2!='none' ? [
        newText("second_Region2", row.second_Region2)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region2")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region3!='none' ? [
        newText("second_Region3", row.second_Region3)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region3")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region4!='none' ? [
        newText("second_Region4", row.second_Region4)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region4")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region5!='none' ? [
        newText("second_Region5", row.second_Region5)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region5")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    (row.second_Region6!='none' ? [
        newText("second_Region6", row.second_Region6)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region6")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    ), 
    (row.second_Region7!="none" ? [
        newText("second_Region7", row.second_Region7)
        .center()
        .css("font-size", "250%")
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region7")
            .remove()
        ] : newText("<p>nnn</p >")
            .hidden()
    ),
    
    (row.second_Region8!='none'? [
        newText("second_Region8",row.second_Region8)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region8")
            .remove()
        ]: newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    (row.second_Region9!='none' ? [
        newText("second_Region9", row.second_Region9)
        .css("font-size", "250%")
        .center()
        .print()
        ,
        newKey(" ")
            .log()
            .wait()
        ,
        getText("second_Region9")
            .remove()
        ]:newText("<p>nnn</p >")
            .hidden()
    
    ),
    
    
    (row.second_Region1 != 'none'?[
        getText("sentB")
            .remove()
        ,
        ]:newText("<p>nnn</p >")
            .hidden()
    ),
    
    
    newText("<strong>Question</strong>", row.Question)
        .css("font-size", "250%")
        .color("green")
        .center()
        .print()
    ,
    newText("Express a judgment from 1 to 7 (1, 2, 3, 4, 5, 6, or 7) <br>For <strong>example</strong>:")
        .css("font-size", "130%")
        .css("text-align", "center")
        .center()
        .print()
    ,
    // newText("<p><strong>1</strong> = assolutamente <strong>improbabile </strong><br><strong>3</strong> = un po' <strong>strana </strong><br><strong>5</strong> = <strong>comprensibile</strong>, probabilmente naturale<br><strong>7</strong> = assolutamente <strong>naturale</strong></p>")
    // ,
    newText("Instruction1",row.Instruction1)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction2",row.Instruction2)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction3",row.Instruction3)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction4",row.Instruction4)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction5",row.Instruction5)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction6",row.Instruction6)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newText("Instruction7",row.Instruction7)
        .css("font-size", "130%")
        //.center()
        .print()
    ,
    newKey("1,2,3,4,5,6,7")
        .log()
        .wait()
)
// ////// SCOMMENTA
  .log( "Email" , getVar("Email") )
  .log( "condition"   , row.Condition  )
  .log( "sent_id"      , row.item_ID     )
  //.log( "stimuli"        , row.stimuli      )
)
SendResults()


// Thank you for participation
newTrial("Thank you for participating",
    newText("<p>The experiment is over!</p>")
        .css("font-size", "200%")
        .center()
        .print()
    ,
    newText("Your information has been saved.")
        .css("font-size", "170%")
        .center()
        .print()
    ,
    newText("insert_info", "<p>Please enter your <strong>full name</strong> in the box below:</p>") 
        .print()
        .center()
        .css("font-size", "120%")
    ,
    newTextInput("input_name")
        .log()
        .center()
        .print()
        .lines(1)
        .css('margin-bottom','20px')
    ,
    newText("take_screenshot", "<p>Take a <strong>screenshot</strong> of this page and <strong>send it</strong> to the following email address <br>as confirmation of your participation.</p>") 
        .print()
        .center()
        .css("font-size", "120%")
    ,
    newText("contact_to_send_to", "<p>lavinia.salicchi@connect.polyu.hk</p>")
        .color("dodgerblue")
        .css("font-size", "120%")
        .center()
        .print()
        //.before(getText("6"))
    ,
    newText("close the tab", "<p>Thank you for participating. <br>You can now close the window.</p>")
        .print()
        .center()
        .css("font-size", "120%")
    ,
    newButton("void")
        .wait()

)
