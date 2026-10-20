# Privacy Policy & Regulatory Compliance Statement — Device Sentinel

**Last Updated:** October 20, 2026  
**Application Name:** Device Sentinel (PhoneStatus)  
**Package Name:** `com.phonestatus.devicesentinel`  
**Developer:** Paluru Hrushikesh  
**Contact Email:** hkdk2000@gmail.com  

---

## 1. Overview & Core Privacy Commitment

**Device Sentinel** is a mobile hardware diagnostic and system telemetry utility engineered with a **zero-data-collection, on-device-first architecture**. 

* We **do not collect, record, harvest, transmit, sell, or rent** any personally identifiable information (PII).
* All system diagnostics, hardware benchmarks, sensor readings, and battery metrics are computed **ephemerally in volatile memory on your local device** and are discarded when the app is closed.
* We do not operate external telemetry servers, user profiling databases, or analytics clouds.

---

## 2. Google Play Store Policy Compliance

Device Sentinel complies with all [Google Play Developer Program Policies](https://play.google.com/about/developer-content-policy/):

### A. Data Safety Section Declarations
When prompted on the Google Play Console Data Safety questionnaire, the following disclosures apply:
* **Does your app collect or share user data?** $\rightarrow$ **No**.
* **Is data encrypted in transit?** $\rightarrow$ **Not Applicable** (no user data is collected or transmitted).
* **Does your app provide a way for users to request data deletion?** $\rightarrow$ **Not Applicable** (no user data is retained).

### B. Permissions Usage Disclosure
Device Sentinel requests the absolute minimum set of standard, non-sensitive Android permissions:
* `android.permission.INTERNET`: Used strictly to execute anonymous HTTP 204 latency pings (`https://1.1.1.1/cdn-cgi/trace` and `https://www.google.com/generate_204`) to calculate your live round-trip network response time (ping in milliseconds). No telemetry or device payload is transmitted.
* `android.permission.ACCESS_NETWORK_STATE`: Used locally to query the active network interface type (Wi-Fi, Cellular, or Offline) and airplane mode state via Android `ConnectivityManager`.
* `android.permission.VIBRATE`: Used locally to drive the haptic feedback actuator test profiles and frequency diagnostic motor pulses.
* **Sensitive Permissions Not Requested:** The app explicitly **does not** request or access:
  * Location (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`)
  * Device Phone State / Telephony (`READ_PHONE_STATE`, IMEI, IMSI)
  * Camera or Photo Library (`CAMERA`, `READ_MEDIA_IMAGES`)
  * Microphone or Audio Recording (`RECORD_AUDIO`)
  * Contacts, SMS, or Call Logs

---

## 3. Government of India Rules & Regulatory Compliance

Device Sentinel fully adheres to the statutory requirements and cybersecurity guidelines established by the Government of India:

### A. Digital Personal Data Protection Act, 2023 (DPDP Act)
* **Scope:** The DPDP Act regulates the processing of digital personal data.
* **Exemption & Compliance:** Because Device Sentinel does not process, ingest, or store "Personal Data" (any data about an individual who is identifiable by or in relation to such data), the processing obligations under Section 4 and Section 6 of the DPDP Act are respected through complete data avoidance.
* **User Autonomy:** The user has total sovereignty over exported technical diagnostic cards. Diagnostic passports are generated only on the user's voluntary initiation and copied solely to the user's local operating system clipboard.

### B. Information Technology Act, 2000 & IT Rules, 2021
Device Sentinel complies with the **Information Technology Act, 2000** (including Sections 43A, 66, 69, 72A) and the **Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021**:
* **No Intermediary Hosting:** Device Sentinel does not host, curate, or publish user-generated content.
* **Reasonable Security Practices:** Adheres to reasonable security protocols by strictly isolating hardware inspection metrics within the sandboxed application environment.
* **Grievance Redressal Mechanism:** In compliance with Rule 3(2) of the IT Rules 2021, a designated Grievance Officer is appointed below to resolve any privacy, security, or compliance queries.

### C. Indian Computer Emergency Response Team (CERT-In) Directions
In compliance with CERT-In directions under Section 70B(6) of the IT Act:
* Device Sentinel contains no malware, backdoors, spyware, or covert surveillance routines.
* The application communicates only with public CDN endpoints for network latency measurement and contains no unauthorized exfiltration channels.

---

## 4. Children’s Privacy (COPPA & IT Rules Compliance)
Device Sentinel is a technical utility intended for general audiences. We do not knowingly collect personal information from children under the age of 18 (in India) or under the age of 13 (under US COPPA).

---

## 5. Security & Data Integrity
* No user accounts or passwords are required to use Device Sentinel.
* No tracking SDKs (e.g., Google Analytics for Firebase, Facebook Pixel, Adjust, AppsFlyer) are embedded.
* No advertising identifiers (Google Advertising ID / AAID) are read or stored.

---

## 6. Grievance Officer Contact Details

In accordance with the **Information Technology Act, 2000**, the **IT Rules, 2021**, and the **DPDP Act, 2023**, inquiries or grievances may be directed to:

* **Designated Officer:** Paluru Hrushikesh  
* **Title:** Grievance & Compliance Officer  
* **App:** Device Sentinel  
* **Email:** hkdk2000@gmail.com  
* **Jurisdiction:** Andhra Pradesh / India  
* **Response Turnaround:** All privacy or compliance inquiries are acknowledged within 24 hours and addressed within 15 business days.

---

## 7. Modifications to This Policy
We may periodically update this policy to reflect future technological additions or statutory changes. Any updates will be reflected with a revised "Last Updated" timestamp.

