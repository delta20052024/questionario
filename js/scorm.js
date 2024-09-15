class ScormWrapper {
    constructor() {
        this.api = this.getAPI();
        this.initialized = false;
    }

    getAPI() {
        let win = window;
        let findAPITries = 0;
        while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
            findAPITries++;
            if (findAPITries > 7) {
                return null;
            }
            win = win.parent;
        }
        return win.API || null;
    }

    isAvailable() {
        return this.api !== null && typeof this.api !== 'undefined';
    }

    initialize() {
        if (this.isAvailable() && !this.initialized) {
            const result = this.api.LMSInitialize("");
            if (result === "true") {
                this.initialized = true;
            } else {
                console.error("SCORM API LMSInitialize failed.");
            }
        }
    }

    terminate() {
        if (this.isAvailable() && this.initialized) {
            const result = this.api.LMSFinish("");
            if (result === "true") {
                this.initialized = false;
            } else {
                console.error("SCORM API LMSFinish failed.");
            }
        }
    }

    save() {
        if (this.isAvailable() && this.initialized) {
            const result = this.api.LMSCommit("");
            if (result !== "true") {
                console.error("SCORM API LMSCommit failed.");
            }
        }
    }

    saveAndFinish() {
        if (this.isAvailable()) {
            this.save();
            this.terminate();
        }
    }

    getSuspendData() {
        if (this.isAvailable()) {
            return this.api.LMSGetValue("cmi.suspend_data");
        }
        return null;
    }

    setSuspendData(data) {
        if (this.isAvailable()) {
            const result = this.api.LMSSetValue("cmi.suspend_data", data);
            if (result !== "true") {
                console.error("SCORM API LMSSetValue for suspend_data failed.");
            }
        }
    }

    getLessonStatus() {
        if (this.isAvailable()) {
            return this.api.LMSGetValue("cmi.core.lesson_status");
        }
        return null;
    }

    setLessonStatus(status) {
        if (this.isAvailable()) {
            const result = this.api.LMSSetValue("cmi.core.lesson_status", status);
            if (result !== "true") {
                console.error("SCORM API LMSSetValue for lesson_status failed.");
            }
        }
    }

    getLessonLocation() {
        if (this.isAvailable()) {
            return this.api.LMSGetValue("cmi.core.lesson_location");
        }
        return null;
    }

    setLessonLocation(location) {
        if (this.isAvailable()) {
            const result = this.api.LMSSetValue("cmi.core.lesson_location", location);
            if (result !== "true") {
                console.error("SCORM API LMSSetValue for lesson_location failed.");
            }
        }
    }

    setSessionTime(time) {
        if (this.isAvailable()) {
            const result = this.api.LMSSetValue("cmi.core.session_time", this.convertTimeToScormFormat(time));
            if (result !== "true") {
                console.error("SCORM API LMSSetValue for session_time failed.");
            }
        }
    }

    convertTimeToScormFormat(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}

