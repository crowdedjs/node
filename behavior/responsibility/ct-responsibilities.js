import AResponsibilityFactory from "./aresponsibility-factory.js"
import CTCATDoScanResponsibility from "./ct-cat-do.js"
import ACK from "./ack.js"


class CTResponsibilities extends AResponsibilityFactory{

get(entry, medicalStaff, hospital) {

		if(entry.unacknowledged(ACK.CT_CAT_DO_SCAN)) {
			hospital.setCTOccupied(true);
			return new CTCATDoScanResponsibility(entry, medicalStaff);
		}
		
		return null;
	}

}

export default CTResponsibilities;