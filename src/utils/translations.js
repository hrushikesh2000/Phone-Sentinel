/**
 * Multi-Language Translations for Phone Sentinel
 * Supports English (en), Hindi (hi), and Telugu (te)
 * Specially phrased for seniors and non-technical users.
 */

export const TRANSLATIONS = {
  en: {
    // App Header & Senior Mode Toggle
    app_title: 'DEVICE SENTINEL',
    senior_mode: 'Senior Mode',
    senior_mode_desc: 'Extra-large text & simple cards',
    language: 'Language',
    refresh: 'Refresh',

    // Dashboard & Senior Cards
    doctor_checkup_btn: 'Start 2-Minute Phone Checkup',
    doctor_checkup_sub: 'Test speaker, screen & battery step-by-step',
    ask_family_btn: 'Send Report to Family on WhatsApp',
    ask_family_sub: 'Share your phone health with children or friends',

    // Status Cards
    battery_title: 'Battery Health',
    battery_status_good: 'Healthy & Long-Lasting',
    battery_status_warn: 'Discharging Fast',
    battery_status_charging: 'Plugged In & Charging',

    sound_title: 'Call & Speaker Sound',
    sound_status_good: 'Loud & Crystal Clear',
    sound_status_check: 'Tap to Test Speaker',

    storage_title: 'Photo & App Storage',
    storage_status_good: 'Plenty of Free Room',
    storage_status_full: 'Almost Full (Needs Cleanup)',

    internet_title: 'Internet & Wi-Fi',
    internet_status_online: 'Connected & Working',
    internet_status_offline: 'No Internet Connection',

    // Doctor Checkup Wizard Steps
    wizard_title: 'Phone Doctor Checkup',
    wizard_step: 'Step',
    wizard_of: 'of',
    wizard_speaker_prompt: 'Listen to the ringing tone playing now. Did you hear it clearly?',
    wizard_speaker_yes: '🔊 Yes, Loud & Clear',
    wizard_speaker_no: '🔇 Trouble Hearing / Faint',

    wizard_touch_prompt: 'Rub your finger over all the colored boxes below like wiping dust off glass.',
    wizard_touch_progress: 'boxes cleaned',

    wizard_vibration_prompt: 'Your phone will now buzz gently. Did you feel the vibration in your hand?',
    wizard_vibration_yes: ' Felt the Buzz',
    wizard_vibration_no: '❌ Did Not Vibrate',

    wizard_done_title: 'Checkup Complete!',
    wizard_done_grade: 'Grade A+ Certified',
    wizard_done_desc: 'All main hardware parts are working properly.',
    wizard_done_btn: 'Finish Checkup ✓',

    // Doctor Prescription / Healthy Tips
    prescription_title: "Doctor's Advice to Keep Phone Healthy",
    tip_1: 'Unplug your charger around 80% to keep battery healthy for 4+ years.',
    tip_2: 'Wipe phone screen with a soft dry cloth to remove finger oils.',
    tip_3: 'Restart your phone once a week for fresh, fast speed.',

    // WhatsApp Message
    whatsapp_greeting: 'Hello! I ran a health check on my phone using Phone Sentinel:',
    whatsapp_battery: '• Battery:',
    whatsapp_storage: '• Storage:',
    whatsapp_overall: '• Overall Health: All core parts working well!',
    whatsapp_closing: 'Could you help me take a look whenever you are free? Thank you!',
    whatsapp_copied: 'Help message copied to clipboard!',

    // Tooltip Labels
    explainer_simple: 'In Simple Words',
    explainer_checks: 'What It Checks',
    explainer_action: 'What You Should Do',
    explainer_got_it: 'Got It, Thanks! ✓',
  },

  hi: {
    // App Header & Senior Mode Toggle
    app_title: 'डिवाइस सेंटिनल',
    senior_mode: 'सरल मोड',
    senior_mode_desc: 'बड़े अक्षर और आसान कार्ड',
    language: 'भाषा',
    refresh: 'ताज़ा करें',

    // Dashboard & Senior Cards
    doctor_checkup_btn: '2-मिनट फोन जांच शुरू करें',
    doctor_checkup_sub: 'स्पीकर, स्क्रीन और बैटरी की आसान जांच',
    ask_family_btn: 'व्हाट्सएप पर परिवार से मदद लें',
    ask_family_sub: 'बच्चों या दोस्तों को फोन की स्थिति भेजें',

    // Status Cards
    battery_title: 'बैटरी की सेहत',
    battery_status_good: 'स्वस्थ और टिकाऊ',
    battery_status_warn: 'बैटरी तेजी से घट रही है',
    battery_status_charging: 'चार्जर लगा है (चार्ज हो रहा है)',

    sound_title: 'स्पीकर और आवाज',
    sound_status_good: 'साफ और तेज आवाज',
    sound_status_check: 'जांचने के लिए टैप करें',

    storage_title: 'फोटो और स्टोरेज',
    storage_status_good: 'काफी जगह खाली है',
    storage_status_full: 'मेमोरी भर रही है (सफाई चाहिए)',

    internet_title: 'इंटरनेट और वाई-फाई',
    internet_status_online: 'इंटरनेट चालू है',
    internet_status_offline: 'इंटरनेट बंद है',

    // Doctor Checkup Wizard Steps
    wizard_title: 'फोन डॉक्टर जांच',
    wizard_step: 'कदम',
    wizard_of: 'का',
    wizard_speaker_prompt: 'बजने वाली घंटी की आवाज सुनें। क्या आपको आवाज साफ सुनाई दी?',
    wizard_speaker_yes: '🔊 हां, बिल्कुल साफ सुनाई दी',
    wizard_speaker_no: '🔇 धीमी या नहीं सुनाई दी',

    wizard_touch_prompt: 'स्क्रीन पर दिख रहे डिब्बों पर उंगली फेरें जैसे धूल साफ कर रहे हों।',
    wizard_touch_progress: 'डिब्बे साफ हुए',

    wizard_vibration_prompt: 'फोन में हल्का कंपन (वाइब्रेशन) होगा। क्या आपने कंपन महसूस किया?',
    wizard_vibration_yes: ' हां, कंपन महसूस हुआ',
    wizard_vibration_no: '❌ कंपन नहीं हुआ',

    wizard_done_title: 'जांच पूरी हो गई!',
    wizard_done_grade: 'ग्रेड A+ उत्तम स्थिति',
    wizard_done_desc: 'फोन के सभी मुख्य भाग बिल्कुल सही काम कर रहे हैं।',
    wizard_done_btn: 'जांच समाप्त करें ✓',

    // Doctor Prescription / Healthy Tips
    prescription_title: 'फोन को स्वस्थ रखने के लिए डॉक्टर की सलाह',
    tip_1: 'बैटरी 80% होने पर चार्जर हटा दें, बैटरी 4 साल तक चलेगी।',
    tip_2: 'स्क्रीन को हल्के सूखे कपड़े से साफ रखें।',
    tip_3: 'हफ्ते में एक बार फोन रीस्टार्ट (बंद करके चालू) जरूर करें।',

    // WhatsApp Message
    whatsapp_greeting: 'नमस्ते! मैंने फोन सेंटिनल से अपने फोन की जांच की:',
    whatsapp_battery: '• बैटरी:',
    whatsapp_storage: '• स्टोरेज:',
    whatsapp_overall: '• कुल स्थिति: फोन के मुख्य हिस्से बिल्कुल ठीक हैं!',
    whatsapp_closing: 'जब आपको समय मिले तो एक बार देख लीजिएगा। बहुत धन्यवाद!',
    whatsapp_copied: 'मैसेज कॉपी हो गया!',

    // Tooltip Labels
    explainer_simple: 'सरल शब्दों में',
    explainer_checks: 'यह क्या जांचता है',
    explainer_action: 'आपको क्या करना चाहिए',
    explainer_got_it: 'समझ गया, धन्यवाद! ✓',
  },

  te: {
    // App Header & Senior Mode Toggle
    app_title: 'డివైస్ సెంటినెల్',
    senior_mode: 'సులభ మోడ్',
    senior_mode_desc: 'పెద్ద అక్షరాలు & సులభమైన కార్డులు',
    language: 'భాష',
    refresh: 'రిఫ్రెష్',

    // Dashboard & Senior Cards
    doctor_checkup_btn: '2-నిమిషాల ఫోన్ పరీక్ష ప్రారంభించండి',
    doctor_checkup_sub: 'స్పీకర్, స్క్రీన్, బ్యాటరీ పూర్తి చెకప్',
    ask_family_btn: 'వాట్సాప్‌లో పిల్లలకు పంపండి',
    ask_family_sub: 'ఫోన్ ఆరోగ్య వివరాలను కుటుంబంతో పంచుకోండి',

    // Status Cards
    battery_title: 'బ్యాటరీ ఆరోగ్యం',
    battery_status_good: 'బాగుంది & ఎక్కువసేపు వస్తుంది',
    battery_status_warn: 'వేగంగా ఖాళీ అవుతోంది',
    battery_status_charging: 'ఛార్జింగ్ అవుతోంది',

    sound_title: 'స్పీకర్ & కాల్ సౌండ్',
    sound_status_good: 'స్పష్టంగా & బిగ్గరగా ఉంది',
    sound_status_check: 'పరీక్షించడానికి తాకండి',

    storage_title: 'ఫోన్ మెమరీ & స్టోరేజ్',
    storage_status_good: 'పుష్కలంగా స్థలం ఉంది',
    storage_status_full: 'మెమరీ నిండిపోతోంది',

    internet_title: 'ఇంటర్నెట్ & వై-ఫై',
    internet_status_online: 'కనెక్ట్ అయి పనిచేస్తోంది',
    internet_status_offline: 'ఇంటర్నెట్ లేదు',

    // Doctor Checkup Wizard Steps
    wizard_title: 'ఫోన్ డాక్టర్ పరీక్ష',
    wizard_step: 'దశ',
    wizard_of: 'లో',
    wizard_speaker_prompt: 'ఇప్పుడు వినిపించే శబ్దాన్ని వినండి. శబ్దం స్పష్టంగా వినిపించిందా?',
    wizard_speaker_yes: '🔊 అవును, స్పష్టంగా వినిపించింది',
    wizard_speaker_no: '🔇 సరిగ్గా వినబడలేదు',

    wizard_touch_prompt: 'కింద ఉన్న రంగుల గడులపై మీ వేలితో తుడిచినట్లుగా రాయండి.',
    wizard_touch_progress: 'గడులు పూర్తయ్యాయి',

    wizard_vibration_prompt: 'మీ ఫోన్ ఇప్పుడు మెల్లగా వైబ్రేట్ అవుతుంది. మీకు ఆ ప్రకంపన తెలిసిందా?',
    wizard_vibration_yes: ' అవును, తెలిసింది',
    wizard_vibration_no: '❌ వైబ్రేట్ అవ్వలేదు',

    wizard_done_title: 'పరీక్ష పూర్తయింది!',
    wizard_done_grade: 'గ్రేడ్ A+ సూపర్ ఆరోగ్యం',
    wizard_done_desc: 'ఫోన్ భాగాలు అన్నీ చక్కగా పనిచేస్తున్నాయి.',
    wizard_done_btn: 'ముగించు ✓',

    // Doctor Prescription / Healthy Tips
    prescription_title: 'ఫోన్ బాగుండటానికి డాక్టర్ సలహాలు',
    tip_1: 'ఛార్జింగ్ 80% రాగానే తీసేయండి, బ్యాటరీ 4 ఏళ్ల పాటు మన్నుతుంది.',
    tip_2: 'ఫోన్ స్క్రీన్‌ను పొడి మెత్తని గుడ్డతో శుభ్రం చేయండి.',
    tip_3: 'వారానికి ఒక్కసారైనా ఫోన్‌ను రీస్టార్ట్ చేయండి.',

    // WhatsApp Message
    whatsapp_greeting: 'నమస్కారం! నేను ఫోన్ సెంటినెల్ యాప్ ద్వారా నా ఫోన్‌ను చెక్ చేశాను:',
    whatsapp_battery: '• బ్యాటరీ:',
    whatsapp_storage: '• స్టోరేజ్:',
    whatsapp_overall: '• మొత్తం ఆరోగ్యం: అన్నీ సరిగ్గా పనిచేస్తున్నాయి!',
    whatsapp_closing: 'మీకు వీలైనప్పుడు ఒకసారి చూడగలరు. ధన్యవాదాలు!',
    whatsapp_copied: 'సందేశం కాపీ చేయబడింది!',

    // Tooltip Labels
    explainer_simple: 'సులభంగా చెప్పాలంటే',
    explainer_checks: 'ఇది ఏమి పరీక్షిస్తుంది',
    explainer_action: 'మీరు ఏమి చేయాలి',
    explainer_got_it: 'అర్థమైంది, ధన్యవాదాలు! ✓',
  },
};

