PennController.ResetPrefix(null); // Keep this here

// DebugOff(); // Uncomment this to turn off debug mode for the final version

// Preload stimuli
// Option 1: If you have a ZIP file with all your resources (audio and images)
// PreloadZip("https://your_server.com/path/to/your_resources.zip");
// Option 2: If your files are in a 'resources' folder relative to your experiment.html
// PennController.AddHost("resources/"); // Then just use filenames like "item1_exhaustive.mp3"

// IMPORTANT: Configure your EyeTrackerURL
// This URL should point to a PHP script on your server to save the eye-tracking data.
// See PCIbex documentation: https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data/
// EyeTrackerURL("https://your_server.com/path/to/your_eyetracker_script.php");


// Define the sequence of the experiment
PennController.Sequence( "setup_eyetracker", "preload_stimuli", randomize("experiment_trial"), "send_results", "thank_you" );

// Standard PCIbex item for preloading stimuli if not using PreloadZip or if you want a loading bar
PennController("preload_stimuli",
    newText("loading_text", "Loading resources, please wait...")
        .print()
    ,
    newButton("loading_button", "Continue") // Will only appear after loading
        .print()
        .wait(PennController.CheckPreloaded()
            .failure(getText("loading_text").text("Failed to load resources."))
        )
    ,
    getText("loading_text").remove(),
    getButton("loading_button").remove()
);


// Welcome and Eye-tracker setup
PennController("setup_eyetracker",
    newText("<p>Welcome to the experiment!</p><p>This experiment uses eye-tracking technology. Please ensure your webcam is uncovered and you are in a well-lit room.</p><p>We will calibrate the eye-tracker now. Please follow the on-screen instructions.</p>")
        .print()
    ,
    newButton("start_calibration", "I understand, start calibration")
        .print()
        .wait()
    ,
    fullscreen() // Recommended for eye-tracking
    ,
    // Initialize and calibrate the eye-tracker
    // Adjust calibration accuracy (e.g., 50) and max attempts (e.g., 2) as needed
    newEyeTracker("tracker").calibrate(50, 2) // [cite: 4]
        .failure(
            // Optional: what to do if calibration fails after max attempts
            clear(),
            newText("Calibration failed. Please check your lighting and webcam, then refresh to try again.")
                .color("red")
                .center()
                .print(),
            newButton().wait() // Halt experiment
        )
    ,
    newText("calibration_done", "<p>Calibration successful. You will see a fixation point before each trial. Please look at it to ensure tracking accuracy.</p><p>Click the button to begin the practice trials or the main experiment.</p>")
        .center()
        .print()
    ,
    newButton("continue_to_experiment", "Continue")
        .center()
        .print()
        .wait()
);

// Define the experimental trial structure
PennController.Template(
    "experiment_data.csv", // Specifies the CSV file to read trial data from
    row => PennController( "experiment_trial",
        // Pre-trial: Eye-tracker check/re-calibration point
        newEyeTracker("tracker")
            .calibrate(50, 1) // Quick recalibration/check [cite: 5]
            .failure( // Fallback to full calibration if check fails
                getEyeTracker("tracker").calibrate(50,2)
            )
        ,
        newTimer("fixation_duration", 500) // Brief pause after calibration screen
            .start()
            .wait()
        ,
        // 1. Play audio sentence
        newAudio("sentence_audio", row.audio_file)
            .play()
            // .wait() // Option 1: Wait for audio to finish BEFORE showing images

        ,
        // 2. Display images (left and right)
        // Create canvases for positioning and as clickable areas/eye-tracking targets
        newCanvas("left_image_canvas", "40vw", "60vh") // Adjust size as needed
            .css("border", "1px solid lightgrey") // Optional: for visibility
            .add("center at 50%", "middle at 50%", newImage("left_image", row.image_left).size("90%", "90%"))
            .print("center at 25vw", "middle at 50vh") // Position left image canvas
        ,
        newCanvas("right_image_canvas", "40vw", "60vh") // Adjust size as needed
            .css("border", "1px solid lightgrey") // Optional: for visibility
            .add("center at 50%", "middle at 50%", newImage("right_image", row.image_right).size("90%", "90%"))
            .print("center at 75vw", "middle at 50vh") // Position right image canvas
        ,
        // Wait for audio to finish if you want images and audio to be co-present before choice
        // This also means eye-tracking starts *after* audio if placed here.
        // If you want eye-tracking during audio, start tracker earlier.
        getAudio("sentence_audio").wait() // Option 2: Audio finishes, images are already on screen

        ,
        // 3. Start Eye-Tracking
        getEyeTracker("tracker")
            .add( getCanvas("left_image_canvas"), getCanvas("right_image_canvas") ) // Elements to track [cite: 12]
            .log() // Enable data logging for the eye-tracker [cite: 13]
            .start()
        ,
        // 4. Collect participant's choice
        newSelector("choice_selector")
            .add( getCanvas("left_image_canvas"), getCanvas("right_image_canvas") )
            .once() // Participant can only click once
            .log("all") // Log which element was selected and RT
            .wait() // Wait for a selection
        ,
        // 5. Stop Eye-Tracking
        getEyeTracker("tracker").stop() // [cite: 16]
        ,
        // 6. Log additional trial information
        // PCIbex automatically logs some general info. Add specific columns from your CSV.
        PennController.log( "item_number", row.item_number )
        ,
        PennController.log( "condition_label", row.condition_label )
        ,
        PennController.log( "audio_file", row.audio_file )
        ,
        PennController.log( "image_left", row.image_left )
        ,
        PennController.log( "image_right", row.image_right )
        ,
        PennController.log( "expected_choice_image", row.expected_choice_image )
        ,
        newTimer("inter_trial_interval", 1000) // Brief pause before next trial
            .start()
            .wait()
    )
    .log( "item_number" ,PennController.GetURLParameter("item_number")) // Log from URL if any
    .log( "condition_label" , PennController.GetURLParameter("condition_label")) // Log from URL if any
);

// Send results
PennController( "send_results" ,
    newText("Please wait while we save your responses...")
        .print()
    ,
    newButton().wait() // Wait for data to be sent (implicit)
    ,
    SendResults() // [cite: 17]
);

// Thank you and end of experiment
PennController( "thank_you" ,
    exitFullscreen(),
    newText("Thank you for your participation! You can now close this window.")
        .center()
        .print()
    ,
    newButton().wait() // Prevent the experiment from closing automatically
)
.setOption("countsForProgressBar",false);