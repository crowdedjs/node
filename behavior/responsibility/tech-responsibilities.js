import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"
import ACK from "./ack.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	 get(entry, medicalStaff, hospital) {
		if(entry.getVitals() == null) {
			return new TakeVitalsResponsibility( entry, medicalStaff);
		}
		else if(entry.getEkg() == null){
			return new TechEKGDo(entry, medicalStaff);
		}else if(hospital.getCTQueue().length > 0 && !hospital.isCTOccupied() && entry.getPatient() == hospital.getCTQueue()[0]) {
			return new TechEKGTakePatientToResponsibility(entry, medicalStaff, hospital.getLocationByName("CT 1"));
		}else if(entry.unacknowledged(ACK.CT_PICKUP)) {
			return new TechCATPickupResponsibility(entry, medicalStaff);
		}
		
		
		return null;
	}
}

export default TechResponsibilities;