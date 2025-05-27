PennController.ResetPrefix(null) // Removes PennController prefixes, kkep this here
// DebugOff(); // Uncomment this line when you are ready to collect actual data to disable debug mode.

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
// Sequence( "welcome", randomize("experiment_trial"), "send_results", SendResults(), "thank_you");
// // "webcam",



// // Welcome page
// newTrial("welcome",
//     defaultText
//         // .css("width", "80%") // Make text block readable
//         // .css("margin", "auto") // Center the text block
//         // .css("font-size", "1em") // Font size
//         .center()
//         .print()
//     ,
//     newText("welcome",  
//         "<p>Welcome!</p>" +
//         "<p>This experiment is part of a project supervised by Dr. Yu-Yin Hsu of The Hong Kong Polytechnic University.</p>" +
//         "<p>· In this online experiment, you will read sentences in Hungarian. <br>· After each sentence, two images will appear on the screen. <br>· Your task will be to click on the image that best fits the sentence you just saw.</p>" +
//         "<p>You can take part in the experment ONLY if you are using use a <strong>computer</strong> with a <strong>physical keyboard</strong>, and a <strong>webcam</strong>. <br>You should start the experiment ONLY if you have the time to <b>complete it</b> and with <b>no rush</b>, it is <b>not possible</b> to save the current session. <br><u>If you <strong>close</strong> the <strong>browser</strong> window, you will have to <strong>start the experiment over</strong></u>.</p>" +
//         "<p>The study will take approximately <strong>30 minutes</strong> to complete. </p>" +
//         "<p>Please pay attention and respond as quickly and accurately as possible.</p>")
//         .center()
//         .print()
//     ,
//     newText("1","<p>If you agree to take part in this study, you consent that the following data will be collected: demographic data, reading times, eye-tracking data and choices made within the trials. These information will be stored anonymously and will only be used for scientific purposes.</p>")
//         .cssContainer("width", "80%")
//         .cssContainer("border", "solid 2px blue")
//         .cssContainer("padding-left", "10px")
//     ,
//     newText("2","<p>If you wish to participate, please select 'I consent to [...]' below. </p>")
//         .center()
//         .print()
//     ,
//     newScale("consent", " I consent to the collection of my data and I wish to participate in the experiment.")
//         .labelsPosition("center")
//         .vertical()
//         .center()
//         .print()
//     ,
//     newText("3","<p>On the next screen we will calibrate the eye-tracker, show you will the instructions, and do a practice round.</p>")
//     ,
//     newButton("continue_button", "Continue")
//         .center()
//         .print()
//         .wait(getScale("consent").test.selected())
//         .css('margin-bottom','20px')
// );

//     // newText("2","<p>If you have any questions, feel free to contact us at:")
//     // ,
//     // newText("7", "gabor.parti@connect.polyu.hk</p>")
//     //     .color("blue")
//     // ,
    
    

// // Calibration page; we do a first calibration here---meanwhile, the resources are preloading
// newTrial("webcam",
//     newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
//             <p>We will only collect data on where on this page your eyes are looking during the experiment.</p>`)
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
//              <p>Click and fixate it for 3 seconds to check that the tracker is still well calibrated.</p>
//              <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
//         .center()
//         .print()
//     ,
//     newButton("Go to the first trial")
//         .center()
//         .print()
//         .wait()
// )

    
    
// Instructions
newTrial("instructions",
    defaultText
        // .css("width", "80%") // Make text block readable
        // .css("margin", "auto") // Center the text block
        // .css("font-size", "1em") // Font size
        .center()
        .print()
    ,
    newText("instructions",
        "<p>In this expriment, you will find Hungarian sentences.</p>" +
        "<p>Before each sentence, you will see a cross (+) in the center of the screen. </p>" +
        "<p><p>You will not see the full sentences, but <b>one word at a time</b>.</p>" +
        "<p>Use the <b>space bar</b> (␣) to move to the next word, which will be shown in the center of your screen.</p>" +
        "<p>Make sure you understand the word on the screen before pressing the space bar and moving to the next one.</p>"
    )
    ,
    newText("newline",
        "<p>/n</p>"
        )
        .hidden()
     ,
    newText("space",
        "____________"
        )
    ,
    newText("<p> (Press the space bar to continue) </p>"
    )
    ,
    newKey(" ")
        .wait()
)

// Wait if the resources have not finished preloading by the time the tracker is calibrated
CheckPreloaded()


// // Experiment 
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",

//         // 1. Play the audio
//         newAudio("sentence_audio", row.audio_file)
//             .log().play().wait(), // Log when audio playback starts and ends; wait for the audio to finish playing before showing images
            
//         // 2. Display the images (left and right) AFTER audio has finished
//         // Images are placed on canvases, which serve as clickable regions.
//         // defaultImage.size("20vh", "20vh"),

// Practice
Template("practice.csv", row => 
    newTrial("practice_1",
    
    // // Check/recalibrate the tracker before every trial  ////////
    // newEyeTracker("tracker").calibrate(50,2)             ////////
    // ,
    // Delay
    newTimer("500", 500).start().wait()
    ,
    newText("practice_sentence", "Practice sentence:")
        .css("font-size", "250%") // Make text large
        .center() // Center the text
        .print()
    ,
    newText("vspace", "<br><br><br><br>").print() // Adds two line breaks
    ,
    newText("spacebar","<p> (Press the space bar to continue) </p>")
        .center().print()
    ,
    newKey(" ").wait()
    ,    
    getText("spacebar").remove()
    ,
    // Fixation
    newText("fixation_cross", "+").center().css("font-size", "250%").print(),
    getTimer("500"),
    getText("fixation_cross").remove()
    ,
    //Show regions
    newText("r1", row.r1)
        .center()
        .css("font-size", "250%")
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r1")
        .remove()
    ,
    newText("r2",row.r2)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r2")
        .remove()
    ,
    newText("r3", row.r3)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r3")
        .remove()
    ,
    newText("r4",row.r4)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r4")
        .remove()
    ,
    newText("r5", row.r5)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r5")
        .remove()
    ,
    newText("r6", row.r6)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r6")
        .remove()
    , 
    newText("r7", row.r7)
        .css("font-size", "250%")
        .center()
        .print()
    ,
    newKey(" ")
        .log()
        .wait()
    ,
    getText("r7")
        .remove()
    ,
    newText("done", 
    "<p>DONE<p/>")
        .css("font-size", "250%")
        .center()
        .print()
    ,

    // SHow images (images are placed on canvases, which serve as clickable regions)
    // defaultImage.size("20vh", "20vh"),

    newCanvas("left_image_canvas", "45vw", "70vh") // Canvas for the left image
        .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
        .print("center at 25vw", "middle at 50vh") // Position canvas on the left
    ,
    newCanvas("right_image_canvas", "45vw", "70vh") // Canvas for the right image
        .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
        .print("center at 75vw", "middle at 50vh") // Position canvas on the right
    ,

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
// )

    
    )
)



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
// )

// // SendResults()

// // 5. Send results to the server
// newTrial( "send_results" ,
//     newText("sending_results_text", "Please wait while we save your responses...")
//         .center()
//         .print()
//     ,
    
//     // The SendResults command will try to send data to the server.
//     // This is handled by PCIbex farm's infrastructure or your own backend if self-hosting.
//     SendResults() // This command handles sending all collected data.
//     ,
//     newTimer("wait_after_send", 500) // Brief pause to ensure data sending process initiates
//         .start()
//         .wait()
//     ,
//     getText("sending_results_text")
//         .text("Your responses have been saved.") // Update text
//     ,
//     newButton().wait(1500) // Wait 1.5 seconds to show "saved" message before thank you screen
// );

// // Thank you screen and end of the experiment
// newTrial( "thank_you",
//     newText("thank_you_text", "<p>Thank you for your participation in this experiment!</p><p>You can now close this window.</p>")
//         .css("width", "80%")
//         .css("margin", "auto")
//         .center()
//         .print()
//     ,
//     // This button is not printed but keeps the page open until the participant closes it.
//     newButton("finish_button").wait()
// )

// newTrial(
//     exitFullscreen()
//     ,
//     newText("The is the end of the experiment, you can now close this window. Thank you!")
//         .center()
//         .print()
//     ,
//     newButton("waitforever").wait() // Not printed: wait on this page forever
// )

// .setOption("countsForProgressBar", false); // This trial does not count towards the progress bar.



// // 5. Thank you screen and end of the experiment
// PennController( "thank_you" ,
//     newText("thank_you_text", "<p>Thank you for your participation in this experiment!</p><p>You can now close this window.</p>")
//         .css("width", "80%")
//         .css("margin", "auto")
//         .center()
//         .print()
//     ,
//     // This button is not printed but keeps the page open until the participant closes it.
//     newButton("finish_button").wait()
// )
