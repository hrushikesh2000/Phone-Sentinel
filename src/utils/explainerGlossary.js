/**
 * Lite, Accessible Knowledge Base for Phone Sentinel
 * Supports English, Hindi, and Telugu.
 * Phrased in 3 quick bite-sized points: 1 analogy, 2 checks, 1 practical action.
 */

export const EXPLAINER_GLOSSARY = {
  audio_frequencies: {
    id: 'audio_frequencies',
    title: {
      en: 'Speaker Sound Check',
      hi: 'स्पीकर और आवाज की जांच',
      te: 'స్పీకర్ & సౌండ్ చెకప్',
    },
    badge: 'Audio Health',
    icon: 'volume-high',
    color: '#00F2FE',
    animationType: 'speaker_cone',
    analogy: {
      en: 'Your phone speaker is like a tiny drum. Playing tones checks if it can vibrate cleanly without buzzing or tearing.',
      hi: 'फोन का स्पीकर एक छोटे ढोल जैसा है। यह जांचता है कि आवाज बिना किसी घरघराहट के साफ आ रही है।',
      te: 'ఫోన్ స్పీకర్ ఒక చిన్న డ్రమ్ లాంటిది. ఇది ఎటువంటి గరగర శబ్దం లేకుండా స్పష్టంగా మోగుతోందో లేదో చూస్తుంది.',
    },
    tested: {
      en: [
        'Voice call clarity & volume across all frequencies',
        'Trapped pocket lint, dust, or dried water droplets',
      ],
      hi: [
        'कॉल पर बात करने की स्पष्टता और आवाज की ताकत',
        'स्पीकर की जाली में फंसी धूल या पानी की बूंदें',
      ],
      te: [
        'ఫోన్ మాట్లాడేటప్పుడు గొంతు స్పష్టత & శబ్దం',
        'స్పీకర్‌లో పేరుకుపోయిన దుమ్ము లేదా నీరు',
      ],
    },
    action: {
      en: 'If sound crackles, gently wipe the speaker mesh with a clean, dry soft toothbrush.',
      hi: 'अगर आवाज फटे, तो नीचे के स्पीकर को सूखे मुलायम ब्रश से हल्के से साफ करें।',
      te: 'శబ్దం సరిగ్గా రాకపోతే, కింద ఉన్న స్పీకర్‌ను పొడి బ్రష్‌తో మెల్లగా శుభ్రం చేయండి.',
    },
  },

  battery_80_guard: {
    id: 'battery_80_guard',
    title: {
      en: '80% Battery Longevity Guard',
      hi: '80% बैटरी जीवन रक्षक',
      te: '80% బ్యాటరీ రక్షణ కవచం',
    },
    badge: 'Battery Lifespan',
    icon: 'shield-checkmark',
    color: '#10B981',
    animationType: 'battery_balloon',
    analogy: {
      en: 'Think of your battery like a rubber balloon. Filling it to 80% keeps it relaxed; forcing it to 100% every day wears it out twice as fast.',
      hi: 'बैटरी एक रबर के गुब्बारे जैसी है। इसे 80% तक भरना सुरक्षित है; रोज 100% भरने से यह जल्दी खराब होती है।',
      te: 'బ్యాటరీ రబ్బరు బెలూన్ లాంటిది. 80% వరకు ఛార్జ్ చేస్తే ఎక్కువ కాలం మన్నుతుంది; రోజూ 100% చేస్తే త్వరగా పాడవుతుంది.',
    },
    tested: {
      en: [
        'Monitors electrical stress when battery approaches 80%',
        'Alerts you to unplug to prevent battery swelling',
      ],
      hi: [
        'बैटरी 80% पहुंचते ही ज्यादा गर्म होने से बचाना',
        'चार्जर हटाने का कोमल संकेत देना ताकि बैटरी फूले नहीं',
      ],
      te: [
        'బ్యాటరీ 80% కి చేరగానే వేడి ఎక్కకుండా కాపాడటం',
        'ఛార్జర్ తీసేయమని అలర్ట్ ఇచ్చి బ్యాటరీ ఉబ్బకుండా చూడటం',
      ],
    },
    action: {
      en: 'Unplug your charger around 80% to keep your battery holding charge for 4+ years.',
      hi: 'बैटरी 80% होने पर चार्जर निकाल दें, आपका फोन 3 से 4 साल तक बढ़िया चलेगा।',
      te: 'ఛార్జింగ్ 80% రాగానే తీసేయండి, మీ ఫోన్ 4 ఏళ్ల పాటు కొత్తదానిలా పనిచేస్తుంది.',
    },
  },

  battery_drain_rate: {
    id: 'battery_drain_rate',
    title: {
      en: 'Battery Discharge Speed',
      hi: 'बैटरी खर्च होने की रफ्तार',
      te: 'బ్యాటరీ ఖర్చయ్యే వేగం',
    },
    badge: 'Power Consumption',
    icon: 'flash-outline',
    color: '#F59E0B',
    animationType: 'battery_balloon',
    analogy: {
      en: 'Like the fuel meter in a car, this shows how much battery percentage your phone burns every hour.',
      hi: 'यह कार के पेट्रोल मीटर जैसा है, जो बताता है कि आपका फोन हर घंटे कितनी बैटरी खर्च कर रहा है।',
      te: 'ఇది కారు పెట్రోల్ మీటర్ లాంటిది, మీ ఫోన్ గంటకు ఎంత శాతం బ్యాటరీ వాడుతుందో చెబుతుంది.',
    },
    tested: {
      en: [
        'Under 10%/hr (Green): Normal, calm everyday usage',
        'Over 20%/hr (Red): Background app or high brightness draining power',
      ],
      hi: [
        '10%/घंटा से कम (हरा): बिल्कुल सामान्य और किफायती',
        '20%/घंटा से ज्यादा (लाल): कोई ऐप या ज्यादा चमक तेजी से बैटरी पी रही है',
      ],
      te: [
        'గంటకు 10% లోపు (ఆకుపచ్చ): చాలా బాగుంది & సాధారణం',
        'గంటకు 20% పైగా (ఎరుపు): బ్యాక్‌గ్రౌండ్ యాప్‌లు బ్యాటరీని లాగేస్తున్నాయి',
      ],
    },
    action: {
      en: 'If battery drains fast, slide down from the top of your screen to lower brightness slightly.',
      hi: 'अगर बैटरी तेजी से घटे, तो स्क्रीन की चमक (ब्राइटनेस) थोड़ी कम कर लें।',
      te: 'బ్యాటరీ వేగంగా అయిపోతుంటే, స్క్రీన్ బ్రైట్‌నెస్‌ను కొద్దిగా తగ్గించండి.',
    },
  },

  battery_thermal: {
    id: 'battery_thermal',
    title: {
      en: 'Battery Temperature & Heat',
      hi: 'बैटरी का तापमान और गर्मी',
      te: 'ఫోన్ వేడి & ఉష్ణోగ్రత',
    },
    badge: 'Thermal Safety',
    icon: 'thermometer-outline',
    color: '#EF4444',
    animationType: 'battery_balloon',
    analogy: {
      en: 'Batteries dislike heat. Keeping your phone cool protects internal parts from swelling or slowing down.',
      hi: 'बैटरी को ज्यादा गर्मी पसंद नहीं। फोन ठंडा रहने से वह कभी नहीं रुकता और लंबा चलता है।',
      te: 'బ్యాటరీకి ఎక్కువ వేడి పడదు. ఫోన్ చల్లగా ఉంటే వేగంగా పనిచేస్తుంది మరియు ఎక్కువ కాలం వస్తుంది.',
    },
    tested: {
      en: [
        'Below 35°C (Cool): Perfect operating zone',
        'Above 42°C (Warm): Phone is working hard or sitting in sunlight',
      ],
      hi: [
        '35°C से कम (ठंडा): सबसे उत्तम स्थिति',
        '42°C से अधिक (गर्म): धूप या भारी काम से फोन गर्म हो रहा है',
      ],
      te: [
        '35°C లోపు (చల్లగా): చాలా మంచి స్థితి',
        '42°C దాటితే (వేడిగా): ఎండలో లేదా ఎక్కువసేపు వాడటం వల్ల వేడెక్కింది',
      ],
    },
    action: {
      en: 'Never leave your phone on a sunny car dashboard, and remove thick cases while fast charging.',
      hi: 'फोन को धूप में न छोड़ें और चार्ज करते समय मोटा कवर हटा दें।',
      te: 'ఫోన్‌ను ఎండలో ఉంచకండి మరియు ఛార్జింగ్ పెట్టేటప్పుడు బ్యాక్ కవర్ తీసేయండి.',
    },
  },

  screen_dead_pixels: {
    id: 'screen_dead_pixels',
    title: {
      en: 'Dead Pixel & Screen Check',
      hi: 'स्क्रीन और डेड पिक्सेल जांच',
      te: 'డిస్‌ప్లే & స్క్రీన్ చెకప్',
    },
    badge: 'Display Health',
    icon: 'color-palette-outline',
    color: '#00F2FE',
    animationType: 'pixel_grid',
    analogy: {
      en: 'Your screen is made of over 2 million microscopic colored light bulbs. A "dead pixel" is a tiny bulb that has burned out.',
      hi: 'स्क्रीन 20 लाख छोटे रंगीन बल्बों से बनी है। "डेड पिक्सेल" वह छोटा बल्ब है जो बुझ गया है।',
      te: 'మీ స్క్రీన్ 20 లక్షల చిన్న రంగు బల్బులతో తయారు చేయబడింది. పాడైన బల్బును "డెడ్ పిక్సెల్" అంటారు.',
    },
    tested: {
      en: [
        'Fills screen with solid Red, Green, Blue, White, and Black',
        'Shows any permanent black speck or frozen bright dot',
      ],
      hi: [
        'स्क्रीन पर लाल, हरा, नीला, सफेद और काला रंग दिखाकर जांच करना',
        'किसी भी फंसे हुए काले या सफेद बिंदु को आसानी से पकड़ना',
      ],
      te: [
        'స్క్రీన్ మొత్తం ఎరుపు, ఆకుపచ్చ, నీలం రంగులతో నింపి పరీక్షించడం',
        'ఎక్కడైనా నల్లటి చుక్క ఉందో లేదో సులభంగా చూడటం',
      ],
    },
    action: {
      en: 'If you see a black dot that cannot be wiped away with cloth on a new phone, claim a warranty replacement.',
      hi: 'अगर स्क्रीन पर ऐसा काला बिंदु दिखे जो कपड़े से न छूटे, तो वारंटी में स्क्रीन बदलवाएं।',
      te: 'తుడిచినా పోని నల్లటి చుక్క కనిపిస్తే, వారంటీలో ఉచితంగా మార్చుకోవచ్చు.',
    },
  },

  touch_digitizer: {
    id: 'touch_digitizer',
    title: {
      en: 'Touch Screen Responsiveness',
      hi: 'टच स्क्रीन और उंगली की पहचान',
      te: 'టచ్ స్క్రీన్ రెస్పాన్స్',
    },
    badge: 'Touch Controller',
    icon: 'finger-print-outline',
    color: '#10B981',
    animationType: 'touch_grid',
    analogy: {
      en: 'Under the glass sits an invisible electrical sensor grid that senses your finger charge wherever you tap.',
      hi: 'शीशे के नीचे अदृश्य तारों का जाल है जो आपकी उंगली का हल्का स्पर्श पहचानता है।',
      te: 'గ్లాస్ కింద కనిపించని సెన్సార్లు ఉంటాయి, ఇవి మీ వేలి స్పర్శను తక్షణమే గుర్తిస్తాయి.',
    },
    tested: {
      en: [
        'Dead corner zones (e.g. keyboard keys like "P" or "Q" not working)',
        'Multi-touch tracking for zooming photos with two fingers',
      ],
      hi: [
        'कोनों में टच काम न करना (जैसे कीबोर्ड के किनारे के बटन)',
        'फोटो को दो उंगलियों से बड़ा (ज़ూम) करने की क्षमता',
      ],
      te: [
        'మూలల్లో టచ్ సరిగ్గా పనిచేయకపోవడం (కీబోర్డ్ అక్షరాలు)',
        'రెండు వేళ్లతో ఫోటోను జూమ్ చేసే సామర్థ్యం',
      ],
    },
    action: {
      en: 'If any corner refuses to turn green when swiping over it, the touch glass may be cracked under the surface.',
      hi: 'अगर किसी कोने पर उंगली फेरने पर भी हरा रंग न आए, तो टच ग्लास खराब हो सकता है।',
      te: 'ఏదైనా మూలన వేలు పెట్టినా స్పందించకపోతే, లోపల టచ్ గ్లాస్ పాడై ఉండవచ్చు.',
    },
  },

  sensors_compass_flux: {
    id: 'sensors_compass_flux',
    title: {
      en: 'Compass & Direction Sensor',
      hi: 'दिशा सूचक और कम्पास',
      te: 'దిక్సూచి & కంపాస్',
    },
    badge: 'Orientation Sensor',
    icon: 'navigate-circle-outline',
    color: '#00F2FE',
    animationType: 'compass_rose',
    analogy: {
      en: 'Acts like a physical magnetic needle pointing North, guiding Google Maps so your navigation arrow points where you walk.',
      hi: 'यह एक चुंबकीय सुई की तरह उत्तर दिशा दिखाता है, ताकि गूगल मैप्स में आपका तीर सही दिशा में चले।',
      te: 'ఇది ఒక అయస్కాంత సూదిలా పనిచేస్తూ, గూగుల్ మ్యాప్స్‌లో మీరు నడిచే సరైన దిశను చూపిస్తుంది.',
    },
    tested: {
      en: [
        'True North heading degrees (0° - 360°)',
        'Magnetic interference from phone cases or magnets',
      ],
      hi: [
        'उत्तर दिशा का सही कोण (0° से 360°)',
        'फोन कवर में लगे चुंबक से होने वाली गड़बड़ी पकड़ना',
      ],
      te: [
        'సరైన ఉత్తర దిశ కోణం (0° నుండి 360° వరకు)',
        'మ్యాగ్నెట్ కవర్ల వల్ల వచ్చే సమస్యలను గుర్తించడం',
      ],
    },
    action: {
      en: 'Wave your phone in a smooth figure-8 motion in the air to recalibrate the compass.',
      hi: 'कम्पास सही करने के लिए फोन को हवा में अंग्रेजी के 8 के आकार में घुमाएं।',
      te: 'దిక్సూచి సరిగ్గా పనిచేయడానికి ఫోన్‌ను గాలిలో ‘8’ ఆకారంలో తిప్పండి.',
    },
  },

  sensors_lux: {
    id: 'sensors_lux',
    title: {
      en: 'Room Light Sensor (Lux)',
      hi: 'कमरे की रोशनी का सेंसर',
      te: 'కాంతి సెన్సార్ (లక్స్)',
    },
    badge: 'Light Sensor',
    icon: 'bulb-outline',
    color: '#F59E0B',
    animationType: 'compass_rose',
    analogy: {
      en: 'A tiny eye at the top of your phone that measures how bright your room is, so auto-brightness adjusts automatically.',
      hi: 'फोन के ऊपर एक छोटी आंख है जो रोशनी नापती है ताकि स्क्रीन की चमक अपने आप सही रहे।',
      te: 'ఫోన్ పైభాగంలో ఉండే చిన్న కన్ను లాంటిది. ఇది గదిలోని వెలుతురును బట్టి స్క్రీన్ బ్రైట్‌నెస్‌ను మారుస్తుంది.',
    },
    tested: {
      en: [
        '0 Lux (Dark bedroom) to 1,000+ Lux (Bright sunlight)',
        'Verifies auto-brightness works smoothly at night',
      ],
      hi: [
        'अंधेरे कमरे से लेकर तेज धूप तक रोशनी की जांच',
        'रात में स्क्रीन की चमक अपने आप धीमी होना',
      ],
      te: [
        'చీకటి గది నుండి ఎండ వరకు వెలుతురును కొలవడం',
        'రాత్రి పూట కళ్లకు శ్రమ లేకుండా కాంతి తగ్గించడం',
      ],
    },
    action: {
      en: 'Cover top edge of phone with hand: reading should drop near 0 Lux.',
      hi: 'फोन के ऊपरी हिस्से को हाथ से ढकें: रोशनी का नंबर 0 के करीब आना चाहिए।',
      te: 'ఫోన్ పైభాగంలో చేయి అడ్డం పెట్టండి: నంబర్ 0 కి పడిపోవాలి.',
    },
  },

  sensors_accelerometer: {
    id: 'sensors_accelerometer',
    title: {
      en: 'Motion & Step Sensor',
      hi: 'गति और कदम गिनने का सेंसर',
      te: 'కదలిక & అడుగుల సెన్సార్',
    },
    badge: 'Motion Sensor',
    icon: 'compass-outline',
    color: '#00F2FE',
    animationType: 'compass_rose',
    analogy: {
      en: 'Senses gravity when you tilt your phone sideways to rotate videos or count walking steps.',
      hi: 'जब आप फोन घुमाते हैं तो यह वीडियो को चौड़ा करता है और आपके चलने पर कदम गिनता है।',
      te: 'ఫోన్‌ను అడ్డంగా తిప్పినప్పుడు వీడియోను తిప్పుతుంది మరియు నడిచేటప్పుడు అడుగులను లెక్కిస్తుంది.',
    },
    tested: {
      en: [
        'Tilt balance horizon (perfectly flat surface indicator)',
        'Pedometer bounce tracking for walking health',
      ],
      hi: [
        'समतल जांच (मेज पूरी तरह सीधी है या नहीं)',
        'रोजाना पैदल चलने के कदम गिनने की क्षमता',
      ],
      te: [
        'బల్ల సమానంగా ఉందో లేదో చూపే బబుల్ లెవల్',
        'నడక అడుగులను లెక్కించే సెన్సార్ పనితీరు',
      ],
    },
    action: {
      en: 'Place phone flat on a table: the round bubble should rest in the center green circle.',
      hi: 'फोन को मेज पर सपाट रखें: गोल बुलबुला बीच के हरे घेरे में आना चाहिए।',
      te: 'ఫోన్‌ను బల్లపై సమంగా పెట్టండి: గుండ్రటి చుక్క మధ్యలోని ఆకుపచ్చ వృత్తంలో ఉండాలి.',
    },
  },

  memory_ram_vs_storage: {
    id: 'memory_ram_vs_storage',
    title: {
      en: 'RAM vs Storage Memory',
      hi: 'रैम (RAM) और स्टोरेज में अंतर',
      te: 'ర్యామ్ & స్టోరేజ్ మధ్య తేడా',
    },
    badge: 'Hardware Memory',
    icon: 'server-outline',
    color: '#8B5CF6',
    animationType: 'ram_desk',
    analogy: {
      en: 'RAM is your Kitchen Counter where you prepare food right now; Storage is your Pantry or Fridge where photos & files are saved forever.',
      hi: 'रैम (RAM) रसोई का काउंटर है जहां आप अभी काम करते हैं; स्टोरेज अलमारी या फ्रिज है जहां फोटो और गाने हमेशा के लिए रखे रहते हैं।',
      te: 'ర్యామ్ (RAM) అనేది వంటగది కౌంటర్ లాంటిది (ప్రస్తుత పనులకు); స్టోరేజ్ అనేది కప్బోర్డ్ లాంటిది (ఫోటోలు ఎప్పటికీ దాచుకోవడానికి).',
    },
    tested: {
      en: [
        'RAM workspace capacity (allows switching between WhatsApp and YouTube)',
        'Storage space headroom (ensures room for new family photos)',
      ],
      hi: [
        'रैम की क्षमता (व्हाट्सएप और यूट्यूब के बीच आसानी से बदलना)',
        'स्टोरेज में खाली जगह (नई तस्वीरें लेने के लिए जगह)',
      ],
      te: [
        'ర్యామ్ సామర్థ్యం (యాప్‌లు వేగంగా మారడానికి)',
        'స్టోరేజ్ స్థలం (కొత్త ఫోటోలు, వీడియోలు దాచుకోవడానికి)',
      ],
    },
    action: {
      en: 'You never need to constantly close apps from RAM. Just keep at least 5GB of free storage space.',
      hi: 'बार-बार ऐप्स बंद करने की जरूरत नहीं है। बस फोन में 5GB जगह खाली रखें।',
      te: 'యాప్‌లను పదే పదే క్లోజ్ చేయనవసరం లేదు. ఫోన్‌లో కనీసం 5GB ఖాళీ స్థలం ఉండేలా చూసుకోండి.',
    },
  },

  hardware_passport: {
    id: 'hardware_passport',
    title: {
      en: 'Hardware Inspection Certificate',
      hi: 'फोन जांच प्रमाण पत्र (पासपोर्ट)',
      te: 'హార్డ్‌వేర్ తనిఖీ ధృవీకరణ పత్రం',
    },
    badge: 'Pre-Owned Verification',
    icon: 'ribbon-outline',
    color: '#F59E0B',
    animationType: 'touch_grid',
    analogy: {
      en: 'Like a doctor’s fitness certificate or a car inspection card, this proves all parts of this phone are healthy.',
      hi: 'जैसे डॉक्टर का फिटनेस सर्टिफिकेट होता है, यह कार्ड साबित करता है कि फोन के सभी हिस्से असली और सही हैं।',
      te: 'డాక్టర్ ఇచ్చే హెల్త్ సర్టిఫికెట్ లాంటిది. ఈ ఫోన్ భాగాలు అన్నీ బాగున్నాయని నిరూపిస్తుంది.',
    },
    tested: {
      en: [
        'Verifies screen, battery, speakers, sensors, and serial hash',
        'Protects buyers & sellers from hidden defects or scams',
      ],
      hi: [
        'स्क्रीन, बैटरी, स्पीकर और सेंसर की पूर्ण जांच रिपोर्ट',
        'पुराना फोन खरीदते या बेचते समय धोखाधड़ी से सुरक्षा',
      ],
      te: [
        'స్క్రీన్, బ్యాటరీ, స్పీకర్ల పూర్తి పరీక్ష నివేదిక',
        'పాత ఫోన్ కొనేటప్పుడు లేదా అమ్మేటప్పుడు ఉపయోగపడుతుంది',
      ],
    },
    action: {
      en: 'Tap "Export Passport Certificate" to copy and share this verified card with buyers or sellers.',
      hi: '"सर्टिफिकेट कॉपी करें" दबाएं और इसे खरीदार या विक्रेता के साथ साझा करें।',
      te: '"సర్టిఫికేట్ కాపీ చేయండి" నొక్కి ఇతరులతో సులభంగా పంచుకోండి.',
    },
  },

  system_health_audit: {
    id: 'system_health_audit',
    title: {
      en: 'Full System Health Audit',
      hi: 'पूर्ण फोन स्वास्थ्य जांच',
      te: 'పూర్తి ఫోన్ ఆరోగ్య తనిఖీ',
    },
    badge: 'Diagnostic Scan',
    icon: 'shield-checkmark',
    color: '#00F2FE',
    animationType: 'touch_grid',
    analogy: {
      en: 'A complete medical checkup that tests your phone’s memory, battery heat, free space, and internet all at once.',
      hi: 'यह पूरे शरीर के चेकअप जैसा है, जो मेमोरी, बैटरी की गर्मी, खाली जगह और इंटरनेट को एक साथ जांचता है।',
      te: 'ఇది పూర్తి శరీర పరీక్ష లాంటిది, ఫోన్ మెమరీ, వేడి, ఖాళీ స్థలం మరియు ఇంటర్నెట్‌ను ఒకేసారి పరీక్షిస్తుంది.',
    },
    tested: {
      en: [
        'Generates an overall 0-100 score (90-100 is Grade A+)',
        'Flags any urgent item in simple green, yellow, or red cards',
      ],
      hi: [
        '0 से 100 का कुल स्वास्थ्य स्कोर (90-100 बहुत बढ़िया है)',
        'हरे, पीले या लाल कार्ड में बताता है कि कहां ध्यान देना है',
      ],
      te: [
        '0 నుండి 100 వరకు స్కోర్ ఇస్తుంది (90-100 చాలా మంచిది)',
        'ఏవైనా సమస్యలు ఉంటే సులభంగా వివరిస్తుంది',
      ],
    },
    action: {
      en: 'Run this scan once a month or whenever your phone feels slow.',
      hi: 'महीने में एक बार या जब भी फोन धीमा लगे, यह जांच जरूर चलाएं।',
      te: 'నెలకు ఒకసారి లేదా ఫోన్ నెమ్మదిగా ఉన్నప్పుడు ఈ పరీక్ష చేయండి.',
    },
  },

  network_latency_ping: {
    id: 'network_latency_ping',
    title: {
      en: 'Internet Speed & Ping Lag',
      hi: 'इंटरनेट की गति और पिंग (Ping)',
      te: 'ఇంటర్నెట్ స్పీడ్ & పింగ్',
    },
    badge: 'Network Health',
    icon: 'wifi-outline',
    color: '#06B6D4',
    animationType: 'speaker_cone',
    analogy: {
      en: 'Ping is like shouting across a canyon and waiting for the echo. Lower milliseconds mean smoother video calls with family.',
      hi: 'पिंग पहाड़ों में आवाज लगाने और प्रतिध्वनि (इको) वापस आने जैसा है। यह जितना कम होगा, वीडियो कॉल उतनी ही साफ होगी।',
      te: 'పింగ్ అనేది ఎదురుగా పిలిచినప్పుడు శబ్దం ఎంత త్వరగా వినబడుతుందో కొలిచే సమయం. ఇది తక్కువగా ఉంటే వీడియో కాల్స్ సాఫీగా సాగుతాయి.',
    },
    tested: {
      en: [
        'Under 50ms: Crisp video calls with zero delay',
        'Over 200ms: Delay causing callers to talk over each other',
      ],
      hi: [
        '50ms से कम: बिना किसी रुकावट के वीडियो कॉल',
        '200ms से अधिक: आवाज में देरी जिससे बातचीत टकराती है',
      ],
      te: [
        '50ms లోపు: ఆలస్యం లేకుండా స్పష్టమైన వీడియో కాల్స్',
        '200ms దాటితే: మాటలు ఒకరిపై ఒకరు పడటం, ఆలస్యం రావడం',
      ],
    },
    action: {
      en: 'If ping is high, turn Airplane Mode ON for 5 seconds and then turn it back OFF.',
      hi: 'अगर आवाज में देरी हो, तो 5 सेकंड के लिए हवाई जहाज मोड (एरोप्लेन मोड) चालू करके फिर बंद करें।',
      te: 'కాల్స్ ఆలస్యమైతే, 5 సెకన్ల పాటు ఏరోప్లేన్ మోడ్ ఆన్ చేసి మళ్లీ ఆఫ్ చేయండి.',
    },
  },
};
