import AResponsibility from "./aresponsibility.js"
import ResponsibilitySubject from "./responsibility-subject.js"

class TakeVitalsResponsibility extends AResponsibility {

	constructor(entry, medicalStaff) {
		super("Take Vitals", 1 /* seconds */, entry, 5, ResponsibilitySubject.PATIENT, medicalStaff);
		// console.log(entry.patient.location)
		// console.log(medicalStaff.location)
		// TODO Auto-generated constructor stub
		// console.log("Start: " + this.getEntry().patient.idx)
	}

	doFinish() {
		this.getEntry().setVitals("Taken");
		// console.log("Done: " + this.getEntry().patient.idx)
	}
}

export default TakeVitalsResponsibility;