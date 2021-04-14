import ResponsibilitySubject from "./responsibility-subject.js"
import AResponsibility from "./aresponsibility.js"
import ACK from "./ack.js"


class ResidentEKGOrderCAT extends AResponsibility{
	
	constructor(entry, medicalStaff, hospital) {
		this.hospital = hospital;
		super("Resident EKG Order CAT", 1 * 1, entry, 4, ResponsibilitySubject.PATIENT, medicalStaff);
	}

	doFinish() {
		this.entry.acknowledge(ACK.RESIDENT_EKG_ORDER_CAT);
		let myPatient = this.entry.getPatient();
		this.hospital.CTQueue.push(myPatient);
		console.log(this.hospital.getCTQueue());

	}
}

export default ResidentEKGOrderCAT;