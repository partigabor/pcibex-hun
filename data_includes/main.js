PennController.ResetPrefix(null) // Keep this here
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

// Define the sequence of the experiment blocks
Sequence( "welcome", randomize("experiment_trial"), "send_results", SendResults(), "thank_you");
// "webcam",

// Welcome page
newTrial("welcome",
    newText("welcome_message", "<p>Welcome to this experiment!</p>" +
                             "<p>In this task, you will hear sentences in Hungarian. After the sentence, two images will appear on the screen.</p>" +
                             "<p>Your task is to click on the image that best matches the sentence you heard.</p>" +
                             "<p>Please pay attention and respond as quickly and accurately as possible.</p>")
        .css("width", "80%") // Make text block readable
        .css("margin", "auto") // Center the text block
        .css("font-size", "1em") //
        .center()
        .print()
    ,
    newButton("start_experiment_button", "I understand, continue.")
        .center()
        .print()
        .wait()
);

// Calibration page; we do a first calibration here---meanwhile, the resources are preloading
newTrial("webcam",
    newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
            <p>We will only collect data on where on this page your eyes are looking during the experiment.</p>`)
        .center()
        .print()
    ,
    newButton("I understand, start the calibration.")
        .center()
        .print()
        .wait( newEyeTracker("tracker").test.ready() )
        .remove()
    ,
    clear()
    ,
    fullscreen()
    ,
    // Start calibrating the eye-tracker, allow for up to 2 attempts
    // 50 means that calibration succeeds when 50% of the estimates match the click coordinates
    // Increase the threshold for better accuracy, but more risks of losing participants
    getEyeTracker("tracker").calibrate(50,2)
    ,
    newText(`<p>You will see the same button in the middle of the screen before each trial.</p>
             <p>Click and fixate it for 3 seconds to check that the tracker is still well calibrated.</p>
             <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
        .center()
        .print()
    ,
    newButton("Go to the first trial")
        .center()
        .print()
        .wait()
)

// Wait if the resources have not finished preloading by the time the tracker is calibrated
CheckPreloaded()

// Experiment 
Template("experiment_data.csv", row => // Trial structure using data from the CSV file
    newTrial( "experiment_trial",
    
        // 0. Check/recalibrate the tracker before every trial
        newEyeTracker("tracker").calibrate(50,2),
        
        // 250ms delay
        newTimer(250).start().wait(),
        
        // // Optional: A brief fixation point or pause before the trial starts
        // newText("fixation_cross", "+").css("font-size", "1em").center().print(),
        // newTimer("fixation_duration", 500).start().wait(), // Show fixation for 500ms
        // getText("fixation_cross").remove(), // Remove fixation cross
        
        // 1. Play the audio
        newAudio("sentence_audio", row.audio_file)
            .log().play().wait(), // Log when audio playback starts and ends; wait for the audio to finish playing before showing images
            
        // 2. Display the images (left and right) AFTER audio has finished
        // Images are placed on canvases, which serve as clickable regions.
        // defaultImage.size("20vh", "20vh"),
        
        newCanvas("left_image_canvas", "45vw", "70vh") // Canvas for the left image
            .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
            .print("center at 25vw", "middle at 50vh") // Position canvas on the left
        ,
        newCanvas("right_image_canvas", "45vw", "70vh") // Canvas for the right image
            .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
            .print("center at 75vw", "middle at 50vh") // Position canvas on the right
        ,
        
        // Activate tracker
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("left_image_canvas"),
                getCanvas("right_image_canvas"),
            )
            .log()  // If this line is missing, the eye-tracking data won't be sent to the server
            .start(),

        newTimer(500).start().wait(),
        
        // 3. Collect participant's choice by clicking on one of the images
        newSelector("choice_selector")
            .add(
                getCanvas("left_image_canvas"), 
                getCanvas("right_image_canvas") ) // Define clickable elements
            .once() // Participant can only click once
            .log() // Log which element was selected (its ID) and the reaction time //"all"?
            .wait(), // Wait for a selection (click)
        
        // Stop tracker to prevent collecting unnecessary data
        getEyeTracker("tracker").stop(),
        
        // Make sure playback is over before moving on
        // getAudio("test").wait("first"),
        // newTimer(250).start().wait(),
        newTimer("inter_trial_interval", 750).start().wait() // Brief pause (750ms) before the next trial
    )
    // Log additional trial information from the CSV file to the results
    // .log("item_number", row.item_number)
    // .log("condition", row.condition)
    // .log("audio_file", row.audio_file)
    // .log("image_left", row.image_left)
    // .log("image_right", row.image_right)
    // .log("expected_choice_image", row.expected_choice_image)

    // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
    // .log( "participant_id" , PennController.GetURLParameter("id") )
)

// SendResults()

// 5. Send results to the server
newTrial( "send_results" ,
    newText("sending_results_text", "Please wait while we save your responses...")
        .center()
        .print()
    ,
    
    // The SendResults command will try to send data to the server.
    // This is handled by PCIbex farm's infrastructure or your own backend if self-hosting.
    SendResults() // This command handles sending all collected data.
    ,
    newTimer("wait_after_send", 500) // Brief pause to ensure data sending process initiates
        .start()
        .wait()
    ,
    getText("sending_results_text")
        .text("Your responses have been saved.") // Update text
    ,
    newButton().wait(1500) // Wait 1.5 seconds to show "saved" message before thank you screen
);

// Thank you screen and end of the experiment
newTrial( "thank_you",
    newText("thank_you_text", "<p>Thank you for your participation in this experiment!</p><p>You can now close this window.</p>")
        .css("width", "80%")
        .css("margin", "auto")
        .center()
        .print()
    ,
    // This button is not printed but keeps the page open until the participant closes it.
    newButton("finish_button").wait()
)

newTrial(
    exitFullscreen()
    ,
    newText("The is the end of the experiment, you can now close this window. Thank you!")
        .center()
        .print()
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)

.setOption("countsForProgressBar", false); // This trial does not count towards the progress bar.



// 5. Thank you screen and end of the experiment
PennController( "thank_you" ,
    newText("thank_you_text", "<p>Thank you for your participation in this experiment!</p><p>You can now close this window.</p>")
        .css("width", "80%")
        .css("margin", "auto")
        .center()
        .print()
    ,
    // This button is not printed but keeps the page open until the participant closes it.
    newButton("finish_button").wait()
)
