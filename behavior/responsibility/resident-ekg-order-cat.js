import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentEKGOrderCAT extends AResponsibility{
	hospital;

	constructor(entry, medicalStaff, hospital) {
		super("Resident EKG Order CAT", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
		this.hospital = hospital;
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_ORDER_CAT);
		let myPatient = this.entry.getPatient();
		this.hospital.CTQueue.push(myPatient);
	}
}

export default ResidentEKGOrderCAT;