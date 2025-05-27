PennController.ResetPrefix(null) // Removes PennController prefixes, kkep this here
// DebugOff(); // Uncomment this line when you are ready to collect actual data to disable debug mode.

// FROM PCIBEX

// IMPORTANT NOTE: when running this project, the eye-tracker will highlight
// the element that it estimates the participant is looking at
// Edit the file PennController.css in the Aesthetics folder to remove highlighting
//
// NOTE: this template will not *actually* collect eye-tracking data,
//       because the command EyeTrackerURL below points to a dummy URL in the

// Resources are hosted as ZIP files on a distant server
// PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/Pictures.zip")
// PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioContext.zip")
// PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioTest.zip")

// If uploading data to a distant server, uncomment the line below and replace the URL
// with one that points to a PHP script that you uploaded to your webserver
// ( see https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data.html#php-script )
// EyeTrackerURL("https://dummy.url/script.php")

// ***

// // Define the sequence of the experiment blocks
Sequence("welcome", "data", "instructions", "calibration", "practice", "start", randomize("experiment_trial"), "send_results", "thank_you");

// Welcome page
newTrial("welcome",
    defaultText
        // .css("width", "80%") // Make text block readable
        // .css("margin", "auto") // Center the text block
        .css("font-size", "110%") // Font size
        .center()
        .print()
        ,
    newText("welcome", "<p>Welcome!</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
    newText("welcome_text",  
        "<p>This experiment is part of a project supervised by Dr. Yu-Yin Hsu of The Hong Kong Polytechnic University.</p>" +
        "<p> · In this online experiment, you will read sentences in Hungarian. <br> · After each sentence, two images will appear on the screen. <br> · Your task will be to click on the image that best fits the sentence you just saw.</p>" +
        "<p>You can take part in the experment ONLY if you are using use a <strong>computer</strong> with a <strong>physical keyboard</strong>, and a <strong>webcam</strong>. <br><br>You should start the experiment ONLY if you have the time to <b>complete it</b> and with <b>no rush</b>; it is <b>not possible</b> to save the current session. <br><br><u>If you <b>close the browser window</b>, you will have to <b>start over</b></u>.</p>" +
        "<p>The study will take approximately <strong>30 minutes</strong> to complete. </p>" +
        "<p>Please pay attention and respond as quickly and accurately as possible!</p>")
        .center()
        .print()
        ,
    newText("box","<p>If you agree to take part in this study, you consent that the following data will be collected: demographic data, reading times, eye movement within this window and the choices you made during the trials. These information will be stored anonymously and will only be used for scientific purposes.</p>")
        .cssContainer("width", "80%")
        .cssContainer("border", "solid 2px blue")
        .cssContainer("padding-left", "10px")
    ,
    // newText("if","<p>If you wish to participate, please select 'I consent to [...]' below. </p>")
    //     .center()
    //     .print()
    // ,
    // newScale("consent", " I consent to the collection of my data and I wish to participate in the experiment.")
    //     .labelsPosition("center")
    //     .vertical()
    //     .css("font-size", "110%")
    //     .center()
    //     .print()
    // ,
    newHtml("consent_form", "consent.html")
        .css("font-size", "110%")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .center()
        .print()
    ,
    newText("next","<p>On the next screens we will show you the instructions, calibrate the eye-tracker, and do a practice round.</p>")
    ,
    newButton("continue_button", "Continue")
        .center()
        .print()
        // .wait(getScale("consent").test.selected())
        .wait(getHtml("consent_form")
        .test.complete()
        .failure(getHtml("consent_form").warn()
        .css('margin-bottom','20px'),
        )
        ),
    
    fullscreen()
);


    // newText("question","<p>If you have any questions, feel free to contact us at:")
    // ,
    // newText("email", "gabor.parti@connect.polyu.hk</p>")
    //     .color("blue")
    // ,



// Participant data
newTrial("data",
    defaultText
        .css("font-size", "110%")
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

    newText("newline", "<p>...</p>").hidden(),
    
    newText("<p>Notice: Before payment, we will check the validity of the recorded data.</p>")
        .css("font-size", "120%")
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
        .css("font-size", "110%")
        .center()
        .print()
    ,
    
    newText("welcome", "<p>Instructions</p>")
        .css("font-size", "150%")
        .center()
        .print()
        ,
        
    newText("newline", "<p>...</p>").hidden(),

    newText("<p>In this experiment, you will read Hungarian sentences.</p>"),
    newText("<p>Before each sentence, you will see an image pair that gives some context.</p>"),
    newText("<p>Before each sentence, you will see a fixation cross (+) in the center of the screen. </p>"),
    newText("<p><p>You will not see the full sentences, but <b>one word at a time</b>.</p>"),
    newText("<p>Use the <b>space bar</b> (␣) to move to the next word, which will be shown in the center of your screen.</p>"),
    newText("<p>Make sure you understand the word on the screen before pressing the space bar and moving to the next one.</p>"),
    newText("<p>After each sentence, you will see <b>two images</b> on the left and right side of the screen.</p>"),
    newText("<p>Your task is to <b>choose</b> the image that best fits the sentence you read.</p>"),
    newText("<p>You must <b>click</b> on an image to make a selection and move on to the next item.</p>"),
        
    newText("newline", "<p>...</p>").hidden(),
    
    newText("Try to respond as quckly and accurately as you can!")
    .css("font-size", "150%")
    .print(),
    
    newText("newline", "<p>...</p>").hidden(),
    
    newText("space", "__________________"),
    newText("<p> (Press the space bar to continue) </p>"),
    newKey(" ").wait()
);



// // Calibration page; we do a first calibration here---meanwhile, the resources are preloading
// newTrial("calibration",
//     defaultText
//         .css("font-size", "110%") // Font size
//         .center()
//         .print(),
        
//     newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
//             <p>We only collect data on where on this page your eyes are looking during the experiment.</p>`)
//         .center()
//         .print()
//     ,
//     newButton("I understand, start the calibration.")
//         .center()
//         .print()
//         .wait( newEyeTracker("tracker").test.ready() )
//         .remove()
//     ,
//     clear()
//     ,
//     fullscreen()
//     ,
//     // Start calibrating the eye-tracker, allow for up to 2 attempts
//     // 50 means that calibration succeeds when 50% of the estimates match the click coordinates
//     // Increase the threshold for better accuracy, but more risks of losing participants
//     getEyeTracker("tracker").calibrate(50,2)
//     ,
//     newText(`<p>You will see the same button in the middle of the screen before each trial.</p>
//              <p>Fixate on it for 3 seconds to check that the tracker is still well calibrated.</p>
//              <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
//         .center()
//         .print()
//     ,
//     newButton("Continue to the practice trials.")
//         .center()
//         .print()
//         .wait()
// );



// Wait if the resources have not finished preloading by the time the tracker is calibrated
CheckPreloaded()



// Practice
Template("practice.csv", row => 
    newTrial("practice",
        defaultText
        .css("font-size", "110%")
        .center()
        .print(),
    
    // // Check/recalibrate the tracker before every trial  ////////
    // newEyeTracker("tracker").calibrate(50,2)             ////////
    // ,                                                    ////////
    
    // Delay
    newTimer("500", 500).start().wait()
    ,
    
    // Show image pair
    newText("practice_text", "Practice " + row.item + "/3")
        .css("font-size", "200%")
        .center()
        .print(),
        
    newCanvas("left_canvas_preview", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("left_image_stimulus_preview", row.image_left).size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas_preview", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("right_image_stimulus_preview", row.image_right).size("90%", "90%"))
        .print("center at 75vw", "middle at 50vh"),

    newTimer("1000", 1000).start().wait(),

    newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newKey(" ").wait(),
    getText("spacebar").remove(),
    getCanvas("left_canvas_preview").remove(),
    getCanvas("right_canvas_preview").remove(),
    
    // Fixation
    newText("fixation_cross", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross").remove(),
    getTimer("500").start().wait(),
    
    //Show regions
    newText("vspace", "").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r5").remove(),
    
    newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r6").remove(),
    
    newText("r7", row.r7).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r7").remove(),
    
    // getText("practice_text").remove()
    // ,
    
//     // Show images (images are placed on canvases, which serve as clickable regions)
//     newCanvas("left_canvas", "30vw", "60vh")
//         .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
//         .print("center at 25vw", "middle at 50vh"),
//     newCanvas("right_canvas", "30vw", "60vh")
//         .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
//         .print("center at 75vw", "middle at 50vh"),

//         // Activate tracker
//         getEyeTracker("tracker")
//             .add(   // We track the Canvas elements   
//                 getCanvas("left_canvas"),
//                 getCanvas("right_canvas"),
//                 )
//                 .log()  // If this line is missing, the eye-tracking data won't be sent to the server
//                 .start(),

//         getTimer("500").start().wait(),
        
//         // Collect participant's choice by clicking on one of the images
//         newSelector("choice_selector")
//             .add(
//                 getCanvas("left_canvas"), 
//                 getCanvas("right_canvas")) // Define clickable elements
//             // .shuffle() // Always shuffles!
//             .once() // Participant can only click once
//             .log() // Log which element was selected (its ID) and the reaction time //"all"?
//             .wait(), // Wait for a selection (click)
        
//         // Stop tracker to prevent collecting unnecessary data
//         getEyeTracker("tracker").stop(),
        
//         // Wait before next round
//         getTimer("500").start().wait(),
    )
//     // Log additional trial information from the CSV file to the results
//     // .log("item_number", row.item_number)
//     // .log("condition", row.condition)
//     // .log("audio_file", row.audio_file)
//     // .log("image_left", row.image_left)
//     // .log("image_right", row.image_right)
//     // .log("expected_choice_image", row.expected_choice_image)

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
        .css("font-size", "110%") // Font size
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
    newButton("Continue to the live trials.")
        .center()
        .print("center at 50vw", "middle at 75vh")
        .wait()
);




// // Real Experiment 
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",

// Experiment
Template("practice.csv", row => 
    newTrial("experiment_trial",
        defaultText
        .css("font-size", "110%")
        .center()
        .print(),
    
    // // Check/recalibrate the tracker before every trial  ////////
    // newEyeTracker("tracker").calibrate(50,2)             ////////
    // ,                                                    ////////
    
    // Delay
    newTimer("500", 500).start().wait()
    ,
    
    // Show image pair
    newCanvas("left_canvas_preview", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("left_image_stimulus_preview", row.image_left).size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh"),
    newCanvas("right_canvas_preview", "30vw", "60vh")
        .add("center at 50%", "middle at 50%", newImage("right_image_stimulus_preview", row.image_right).size("90%", "90%"))
        .print("center at 75vw", "middle at 50vh"),

    newTimer("1000", 1000).start().wait(),

    newText("spacebar","<p> (Press the space bar to continue) </p>").center().print("center at 50vw", "middle at 50vh"),
    newKey(" ").wait(),
    getText("spacebar").remove(),
    getCanvas("left_canvas_preview").remove(),
    getCanvas("right_canvas_preview").remove(),
    
    // Fixation
    newText("fixation_cross", "+").center().css("font-size", "250%").print("center at 50vw", "middle at 50vh"),
    getTimer("1000").start().wait(),
    getText("fixation_cross").remove(),
    getTimer("500").start().wait(),
    
    //Show regions
    newText("vspace", "").css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    
    newText("r1", row.r1).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r1").remove(),
    
    newText("r2", row.r2).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r2").remove(),
    
    newText("r3", row.r3).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r3").remove(),
    
    newText("r4", row.r4).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r4").remove(),
    
    newText("r5", row.r5).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r5").remove(),
    
    newText("r6", row.r6).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r6").remove(),
    
    newText("r7", row.r7).css("font-size", "200%").print("center at 50vw", "middle at 50vh"),
    newKey(" ").log().wait(),
    getText("r7").remove(),
    
    // // Show images (images are placed on canvases, which serve as clickable regions)
    // newCanvas("left_canvas", "30vw", "60vh")
    //     .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
    //     .print("center at 25vw", "middle at 50vh"),
    // newCanvas("right_canvas", "30vw", "60vh")
    //     .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
    //     .print("center at 75vw", "middle at 50vh"),

    //     // Activate tracker
    //     getEyeTracker("tracker")
    //         .add(   // We track the Canvas elements   
    //             getCanvas("left_canvas"),
    //             getCanvas("right_canvas"),
    //             )
    //             .log()  // If this line is missing, the eye-tracking data won't be sent to the server
    //             .start(),

    //     getTimer("500").start().wait(),
        
    //     // Collect participant's choice by clicking on one of the images
    //     newSelector("choice_selector")
    //         .add(
    //             getCanvas("left_canvas"), 
    //             getCanvas("right_canvas")) // Define clickable elements
    //         // .shuffle() // Always shuffles!
    //         .once() // Participant can only click once
    //         .log() // Log which element was selected (its ID) and the reaction time //"all"?
    //         .wait(), // Wait for a selection (click)
        
    //     // Stop tracker to prevent collecting unnecessary data
    //     getEyeTracker("tracker").stop(),
        
    //     // Wait before next round
    //     getTimer("500").start().wait(),
    )
//     // Log additional trial information from the CSV file to the results
//     // .log("item", row.item_number)
//     // .log("condition", row.condition)
//     // .log("image_left", row.image_left)
//     // .log("image_right", row.image_right)
//     // .log("expected_choice", row.expected_choice)

//     // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
//     // .log( "participant_id" , PennController.GetURLParameter("id") )
);


////////////////////////

// // Experiment 
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",
    
//         // 0. Check/recalibrate the tracker before every trial
//         newEyeTracker("tracker").calibrate(50,2),
        
//         // 250ms delay
//         newTimer(250).start().wait(),
        
//         // // Optional: A brief fixation point or pause before the trial starts
//         // newText("fixation_cross", "+").css("font-size", "1em").center().print(),
//         // newTimer("fixation_duration", 500).start().wait(), // Show fixation for 500ms
//         // getText("fixation_cross").remove(), // Remove fixation cross
        
//         // 1. Play the audio
//         newAudio("sentence_audio", row.audio_file)
//             .log().play().wait(), // Log when audio playback starts and ends; wait for the audio to finish playing before showing images
            
//         // 2. Display the images (left and right) AFTER audio has finished
//         // Images are placed on canvases, which serve as clickable regions.
//         // defaultImage.size("20vh", "20vh"),
        
//         newCanvas("left_image_canvas", "45vw", "70vh") // Canvas for the left image
//             .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
//             .print("center at 25vw", "middle at 50vh") // Position canvas on the left
//         ,
//         newCanvas("right_image_canvas", "45vw", "70vh") // Canvas for the right image
//             .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
//             .print("center at 75vw", "middle at 50vh") // Position canvas on the right
//         ,
        
//         // Activate tracker
//         getEyeTracker("tracker")
//             .add(   // We track the Canvas elements   
//                 getCanvas("left_image_canvas"),
//                 getCanvas("right_image_canvas"),
//             )
//             .log()  // If this line is missing, the eye-tracking data won't be sent to the server
//             .start(),

//         newTimer(500).start().wait(),
        
//         // 3. Collect participant's choice by clicking on one of the images
//         newSelector("choice_selector")
//             .add(
//                 getCanvas("left_image_canvas"), 
//                 getCanvas("right_image_canvas") ) // Define clickable elements
//             .once() // Participant can only click once
//             .log() // Log which element was selected (its ID) and the reaction time //"all"?
//             .wait(), // Wait for a selection (click)
        
//         // Stop tracker to prevent collecting unnecessary data
//         getEyeTracker("tracker").stop(),
        
//         // Make sure playback is over before moving on
//         // getAudio("test").wait("first"),
//         // newTimer(250).start().wait(),
//         newTimer("inter_trial_interval", 750).start().wait() // Brief pause (750ms) before the next trial
//     )
//     // Log additional trial information from the CSV file to the results
//     // .log("item_number", row.item_number)
//     // .log("condition", row.condition)
//     // .log("audio_file", row.audio_file)
//     // .log("image_left", row.image_left)
//     // .log("image_right", row.image_right)
//     // .log("expected_choice_image", row.expected_choice_image)

//     // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
//     // .log( "participant_id" , PennController.GetURLParameter("id") )
//



// Send results to the server
newTrial("send_results",
    defaultText
        .css("font-size", "110%")
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
    .css("font-size", "110%")
    .center()
    .print(),
    
    newText("thank_you_text", "<p>This is the end of the experiment, thank you for your participation!</p>").print(),
    newText("close_text", "<p>You can now close this window.</p>").print(),
    
    // This button is not printed but keeps the page open until the participant closes it.
    newButton("finish_button").wait(),
)

// .setOption("countsForProgressBar", false); // This trial does not count towards the progress bar.
