import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"
import ACK from "./ack.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	get(entry, medicalStaff, hospital) {
		
		if (hospital.aTeam[3] == null) {
			hospital.aTeam[3] = medicalStaff;
		}
		
		// what else should the tech do?
		if (hospital.emergencyQueue.length > 0) {
			let emergencyPatient = hospital.computer.entries.find(i=>i.getPatient().getSeverity() == "ESI1");
			if (emergencyPatient.getVitals() == null || emergencyPatient.getVitals() == undefined) {
				// entry.setTech(medicalStaff);
				emergencyPatient.setTech(medicalStaff);
				//return new TakeVitalsResponsibility( entry, medicalStaff);
				return new TakeVitalsResponsibility(emergencyPatient, medicalStaff);
			}
		}
		
		if (entry.getTech() == null || entry.getTech() == medicalStaff) {
			entry.setTech(medicalStaff);
			
			if(entry.getVitals() == null || entry.getVitals() == undefined) {
				// console.log(medicalStaff.idx)
				return new TakeVitalsResponsibility( entry, medicalStaff);
			}
			else if(entry.getEkg() == null){
				return new TechEKGDo(entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.CT_PICKUP)) {
				entry.getPatient().setCATScan(true);
				return new TechCATPickupResponsibility(entry, medicalStaff);
			}
			//else if(hospital.getCTQueue().length > 0 && !hospital.isCTOccupied() && entry.getPatient() == hospital.getCTQueue()[0]) {
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == null && hospital.getCTQueue().length > 0 && !hospital.isCT1Occupied() && (entry.getPatient() == hospital.getCTQueue()[0] || entry.getPatient() == hospital.getCTQueue()[1])) {
				hospital.setCT1Occupied(true);
				entry.getPatient().setCTRoom("CT 1");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == null && hospital.getCTQueue().length > 0 && !hospital.isCT2Occupied() && (entry.getPatient() == hospital.getCTQueue()[0] || entry.getPatient() == hospital.getCTQueue()[1])) {
				hospital.setCT2Occupied(true);
				entry.getPatient().setCTRoom("CT 2");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, hospital.getLocationByName("CT 2"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == "CT 1") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getCATScan() && entry.getPatient().getCTRoom() == "CT 2") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, hospital.getLocationByName("CT 2"));
			}
		}
		//console.log("null");
		return null;
	}
}

export default TechResponsibilities;