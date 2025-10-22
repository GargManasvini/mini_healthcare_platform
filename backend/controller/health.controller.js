import { Health } from "../models/Health.model.js";

export const submitHealth = async (req, res) => {
    try {
        const { sleep, appetite, stress, activity } = req.body;

        // Convert to numbers
        const sleepNum = Number(sleep);
        const appetiteNum = Number(appetite);
        const stressNum = Number(stress);
        const activityNum = Number(activity);

        // Validate: fields must not be empty and must be numbers
        if (
            sleep === '' || appetite === '' || stress === '' || activity === '' ||
            [sleepNum, appetiteNum, stressNum, activityNum].some(f => isNaN(f))
        ) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required and must be numbers' 
            });
        }

        // ===== Scoring-based Ayurvedic Mock AI Logic =====
        let vata = 0, pitta = 0, kapha = 0;

        if (sleepNum < 3) vata++;
        if (appetiteNum > 4 || appetiteNum < 2) pitta++;
        if (stressNum > 3) { vata++; pitta++; }
        if (activityNum < 2) kapha++;

        // Determine dominant imbalance
        const maxScore = Math.max(vata, pitta, kapha);
        let result = '', recommendation = '';

        if (maxScore === 0) {
            result = 'Balanced';
            recommendation = 'Your dosha balance looks good. Keep maintaining your routine!';
        } else if (maxScore === vata) {
            result = 'Vata Imbalance';
            recommendation = 'Try to maintain regular sleep, calm activities, and meditation.';
        } else if (maxScore === pitta) {
            result = 'Pitta Imbalance';
            recommendation = 'Avoid spicy food and practice cooling exercises or breathing.';
        } else if (maxScore === kapha) {
            result = 'Kapha Imbalance';
            recommendation = 'Increase physical activity and eat light meals.';
        }

        // Save entry
        const healthEntry = new Health({
            userId: req.user._id,
            sleep: sleepNum,
            appetite: appetiteNum,
            stress: stressNum,
            activity: activityNum,
            result,
            recommendation
        });

        await healthEntry.save();

        return res.status(201).json({
            success: true,
            message: 'Health data submitted successfully',
            data: healthEntry
        });

    } catch (error) {
        console.error('Error submitting health data:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error, please try again later' 
        });
    }
};

export const getHealthHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await Health.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching health history:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error, please try again later' 
        });
    }
};
