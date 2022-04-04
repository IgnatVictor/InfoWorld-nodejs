module.exports = function printHospitalAndMedic(medics, facility) {
  let hospitalsByMedic = {};
  var sameIdError = true;

  medics.forEach((medic) => {
    if (facility.includes(medic.facilityId)) {
      let name = medic.familyName + " " + medic.givenName;
      hospitalsByMedic[medic.iD] = hospitalsByMedic[medic.iD] || {
        name,
        hospitals: [],
      };

      if (hospitalsByMedic[medic.iD].name !== name) {
        console.log(`'Csv has same id on different names' ${medic.iD} `);
        sameIdError = false;
      }

      if (medic.active === "true") {
        hospitalsByMedic[medic.iD].hospitals.push(medic.nameId);
      }
    }
  });

  // show data
  if (sameIdError) {
    for (const [key, value] of Object.entries(hospitalsByMedic)) {
      console.log(value.name + ": " + value.hospitals);
    }
  }
};
