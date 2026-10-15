# Conversation Prompt History

This document records all user prompts submitted during the development of the Singapore LTA Bus Arrival & Delay Tracking application.

---

### Prompt 1: Initial Application Build
**Timestamp**: 2026-10-14 23:39:05 SGT  
**Request**:
```text
Build a Singapore based bus arrival time application that tracks real time bus locations and provides alerts for bus delays and upcoming arrival times for all LTA bus stops. Build just the front end now, leave the backend connections to later.
```

---

### Prompt 2: GitHub Repository Setup & Push
**Timestamp**: 2026-10-14 23:50:40 SGT  
**Request**:
```text
git push https://<GITHUB_TOKEN>@https://github.com/snleigh-pixel/LTAtest.git
```
*(GitHub Personal Access Token masked for security)*

---

### Prompt 3: Git Status & Re-push Check
**Timestamp**: 2026-10-14 23:56:48 SGT  
**Request**:
```text
git push https://<GITHUB_TOKEN>@https://github.com/snleigh-pixel/LTAtest.git
```
*(GitHub Personal Access Token masked for security)*

---

### Prompt 4: Serverless LTA DataMall v3 Backend Connection
**Timestamp**: 2026-10-15 00:03:55 SGT  
**Request**:
```text
add a serverless connection that pulls live data from LTA Datamall using the following end points: - store this in /api folder (project root level) not the src folder - include /health.ts and /busarrivals.ts within that subfolder - do not hardcode any key, i will include them later     GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
AccountKey: <LTA_ACCOUNT_KEY>
accept: application/json
```

---

### Prompt 5: Gather All Prompts
**Timestamp**: 2026-10-15 00:54:26 SGT  
**Request**:
```text
gather all the prompts to prompt.md file
```
