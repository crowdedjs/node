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
		if (myPatient.getSeverity() == "ESI1" && this.hospital.CTQueue[0].getSeverity() != "ESI1") {
			this.hospital.CTQueue.unshift(myPatient);
			//console.log(this.hospital.getCTQueue());
		}
		else if (myPatient.getSeverity() == "ESI1" && this.hospital.CTQueue[0].getSeverity() == "ESI1") {
			let i = 0;
			while (this.hospital.CTQueue[i].getSeverity() == "ESI1") {
				i++;
			}
			
			this.hospital.CTQueue.splice(i, 0, myPatient);
			//console.log(this.hospital.getCTQueue());
		}
		else {
			this.hospital.CTQueue.push(myPatient);
			//console.log(this.hospital.getCTQueue());
		}
		
		//console.log(this.hospital.getCTQueue());
	}
}

export default ResidentEKGOrderCAT;