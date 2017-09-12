var PooledCohortAha10YearRisk = new function() {

	/**
	 * Get the 10 year risk.
	 * 
	 * @param age
	 *            Patient's age
	 * @param sex
	 *            "Male" or "Female".
	 * @param race
	 *            "White" - white or other. "Black" - african american.
	 * @param systolicBp
	 *            Systolic blood pressure.
	 * @param totalCholesterol
	 *            The total cholesterol.
	 * @param hdlCholesterol
	 *            The HDL (good) cholesterol.
	 * @param smoker
	 *            True if smoker, false if not.
	 * @param treatedBp
	 *            True if treated BP, false if no treatment.
	 * @param diabetes
	 *            True if diabetic, false if not.
	 * @returns A JSON object with the risk percentages in the form of:
	 *          {patientRisk:-1, normalRisk:-1, optimalRisk:-1, 
	 *          errorMsg:"some message", suggestedChangeAry: [{}]};
	 */
	this.getRisk = function(age, sex, race, systolicBp, totalCholesterol, hdlCholesterol,
			smoker, treatedBp, diabetes) {
		//alert("Selected Race :"+race);
		var rtnObj = {patientRisk:-1, normalRisk:-1, optimalRisk:-1, errorMsg: null, suggestedChangeAry: null};
		if(typeof age === 'undefined'){
			rtnObj.errorString = 'Age is undefined';
			return rtnObj;
		}
		if(typeof totalCholesterol === 'undefined'){
			rtnObj.errorString = 'Total cholesterol is undefined';
			return rtnObj;
		}
		if(typeof hdlCholesterol === 'undefined'){
			rtnObj.errorString = 'HDL is undefined';
			return rtnObj;
		}
		if(typeof systolicBp === 'undefined'){
			rtnObj.errorString = 'Systolic blood pressure is undefined';
			return rtnObj;
		}
		if(typeof treatedBp === 'undefined'){
			rtnObj.errorString = 'Treated blood pressure (Y/N) is undefined';
			return rtnObj;
		}
		if(typeof smoker === 'undefined'){
			rtnObj.errorString = 'Smoker is undefined';
			return rtnObj;
		}
		if(typeof sex === 'undefined'){
			rtnObj.errorString = 'Sex is undefined';
			return rtnObj;
		}
		if(typeof diabetes === 'undefined'){
			rtnObj.errorString = 'Diabetes is undefined';
			return rtnObj;
		}
		
		if(typeof diabetes !== 'boolean'){
			rtnObj.errorString = 'Diabetes must be a boolean value';
			return rtnObj;
		}
		if(typeof smoker !== 'boolean'){
			rtnObj.errorString = 'Smoker must be a boolean value';
			return rtnObj;
		}
		if(typeof treatedBp !== 'boolean'){
			rtnObj.errorString = 'treatedBp must be a boolean value';
			return rtnObj;
		}
		// change treatedBp and smoker to int values
		age = parseInt(age);
		totalCholesterol = parseInt(totalCholesterol);
		hdlCholesterol = parseInt(hdlCholesterol);
		systolicBp = parseInt(systolicBp);

		if(isNaN(age) || age > 79 || age < 40){
			rtnObj.errorString = 'Invalid value for age, valid values: 40 to 79';
			return rtnObj;  
		}
		if(isNaN(totalCholesterol) || totalCholesterol > 320 || totalCholesterol < 130){
			rtnObj.errorString = 'Invalid value for total cholesterol, valid values: 130 to 320';
			return rtnObj;
		}
		if(isNaN(hdlCholesterol) || hdlCholesterol > 100 || hdlCholesterol < 20){
			rtnObj.errorString = 'Invalid value for hdl, valid values: 20 to 100';
			return rtnObj;
		}
		if(isNaN(systolicBp) || systolicBp > 200 || systolicBp < 90){
			rtnObj.errorString = 'Invalid value for systolic blood pressure, valid values: 90 to 200';
			return rtnObj;
		}		

		if (sex == 'M' || sex == 'Male') {
			rtnObj.patientRisk = maleRisk(sex, age, race, totalCholesterol, hdlCholesterol,
					systolicBp, treatedBp, diabetes, smoker);
			
			// retrieve normal risk
			rtnObj.normalRisk = maleRisk(sex, age, race, baselineNormalData.tcl, baselineNormalData.hdl,
					baselineNormalData.sbp, baselineNormalData.trtbp, diabetes, baselineNormalData.smoker);
			
			// retrieve optimal risk
			rtnObj.optimalRisk = maleRisk(sex, age, race, baselineOptimalData.tcl, baselineOptimalData.hdl,
					baselineOptimalData.sbp, baselineOptimalData.trtbp, diabetes, baselineOptimalData.smoker);
		}

		if (sex == 'F' || sex == 'Female') {
			rtnObj.patientRisk = femaleRisk(sex, age, race, totalCholesterol, hdlCholesterol,
					systolicBp, treatedBp, diabetes, smoker);
			
			// retrieve normal risk
			rtnObj.normalRisk = femaleRisk(sex, age, race, baselineNormalData.tcl, baselineNormalData.hdl,
					baselineNormalData.sbp, baselineNormalData.trtbp, diabetes, baselineNormalData.smoker);
			
			// retrieve optimal risk
			rtnObj.optimalRisk = femaleRisk(sex, age, race, baselineOptimalData.tcl, baselineOptimalData.hdl,
					baselineOptimalData.sbp, baselineOptimalData.trtbp, diabetes, baselineOptimalData.smoker);
		}
		
		// retrieve suggested changes
		rtnObj.suggestedChangeAry = getSuggestedChangeAry(sex, age, race, totalCholesterol, hdlCholesterol,
				systolicBp, treatedBp, diabetes, smoker, rtnObj.patientRisk);
		//alert("patientRisk :"+rtnObj.patientRisk);
		//alert("normalRisk :"+rtnObj.normalRisk);
		//alert("optimalRisk :"+rtnObj.optimalRisk);
		//alert("suggestedChangeAry :"+rtnObj.suggestedChangeAry[0]);
		return rtnObj;
	};
	
	/**
	 * Determines which reductions in risk factors would produce results, then sorts them by impact of results
	 */
	var getSuggestedChangeAry = function(sex, age, race, totalCholesterol, hdlCholesterol,
			systolicBp, treatedBp, diabetes, smoker, baseRisk){
		var rtnAry = new Array();
		var riskFunction = (sex == "Male" || sex == "M") ? maleRisk : femaleRisk;

		// If the patient is a smoker, run as non-smoker to see risk difference
		if(smoker){
			var nonSmokingRisk = riskFunction(sex, age, race, totalCholesterol, hdlCholesterol,
					systolicBp, treatedBp, diabetes, false);
			
			// only add this to the list if the risk has improved
			if(baseRisk > nonSmokingRisk)
				rtnAry.push({changeType: "smoker", oldValue: true, newValue: false, reducedRiskPercent: Math.round(10.0*(baseRisk - nonSmokingRisk))/10.0});
		}
		
		// If the patient has high blood pressure, run as ideal blood pressure to see risk difference
		if(systolicBp > baselineOptimalData.sbp){
			var reducedSbpRisk = riskFunction(sex, age, race, totalCholesterol, hdlCholesterol,
					baselineOptimalData.sbp, treatedBp, diabetes, smoker);

			// only add this to the list if the risk has improved
			if(baseRisk > reducedSbpRisk)
				rtnAry.push({changeType: "systolicBp", oldValue: systolicBp, newValue: baselineOptimalData.sbp, reducedRiskPercent: Math.round(10.0*(baseRisk - reducedSbpRisk))/10.0});
		}
		
		// If this is a cholesterol related assessment and the patient has high total cholesterol, run that difference
		if(totalCholesterol > baselineOptimalData.tcl){
			var reducedTclRisk = riskFunction(sex, age, race, baselineOptimalData.tcl, hdlCholesterol,
					systolicBp, treatedBp, diabetes, smoker);

			// only add this to the list if the risk has improved
			if(baseRisk > reducedTclRisk)
				rtnAry.push({changeType: "totalCholesterol", oldValue: totalCholesterol, newValue: baselineOptimalData.tcl, reducedRiskPercent: Math.round(10.0*(baseRisk - reducedTclRisk))/10.0});
		}
		
		// If this is a cholesterol related assessment and the patient has low hdl cholesterol, run that difference
		if(hdlCholesterol < baselineOptimalData.hdl){
			var reducedHdlRisk = riskFunction(sex, age, race, totalCholesterol, baselineOptimalData.hdl,
					systolicBp, treatedBp, diabetes, smoker);

			// only add this to the list if the risk has improved
			if(baseRisk > reducedHdlRisk)
				rtnAry.push({changeType: "hdlCholesterol", oldValue: hdlCholesterol, newValue: baselineOptimalData.hdl, reducedRiskPercent: Math.round(10.0*(baseRisk - reducedHdlRisk))/10.0});
		}

		// sort our list descending on reducedRiskPercent
		rtnAry.sort(function(a,b){return b.reducedRiskPercent - a.reducedRiskPercent;});
		//alert("rtn array "+rtnAry.toString());
		return rtnAry;
	};
	
	var baselineNormalData =
	{
	    sbp: 125, tcl: 180, hdl: 45, smoker: false, diabetes: false, trtbp: false
	};	
	
	var baselineOptimalData =
	{
	    sbp: 110, tcl: 160, hdl: 60, smoker: false, diabetes: false, trtbp: false
	};


	var maleRisk = function(sex, age, race, totalCholesterol, hdlCholesterol,
			systolicBp, treatedBp, diabetes, smoker) {
		// helpful booleans
		var isWhite = race == "White";

		var cAge = (isWhite ? 12.344 : 2.469) * Math.log(age);
		var cChol = (isWhite ? 11.853 : 0.302) * Math.log(totalCholesterol);
		var cAgeChol = -2.664 * Math.log(totalCholesterol) * Math.log(age) * (isWhite ? 1 : 0);
		var cHdl = (isWhite ? -7.990 : -0.307) * Math.log(hdlCholesterol);
		var cAgeHdl = 1.769 * Math.log(age) * Math.log(hdlCholesterol) * (isWhite ? 1 : 0);
		var cBp = (isWhite ? (treatedBp ? 1.797 : 1.764) : (treatedBp ? 1.916 : 1.809)) * Math.log(systolicBp);
		var cSmoker = (smoker ? (isWhite ? 7.837 : 0.549) : 0.0);
		var cAgeSmoker = -1.795 * Math.log(age) * (smoker ? 1 : 0.0) * (isWhite ? 1 : 0);
		var cDiabetes = (isWhite ? 0.658 : 0.645) * (diabetes ? 1 : 0.0);
		var sum = cAge + cChol + cAgeChol + cHdl + cAgeHdl + cBp + cSmoker + cAgeSmoker + cDiabetes;

		var exp = Math.exp(sum - (isWhite ? 61.1816 : 19.5425));
		
		var survival = Math.pow((isWhite ? 0.91436 : 0.89536), exp);
		var risk = 1.0 - survival;
		//alert("male Risk : "+Math.round(risk*1000.0) / 10.0);
		return Math.round(risk*1000.0) / 10.0;
	};

	var femaleRisk = function(sex, age, race, totalCholesterol, hdlCholesterol,
			systolicBp, treatedBp, diabetes, smoker) {
		// helpful booleans
		var isWhite = race == "White";
		
		var cAge = (isWhite ? -29.799 : 17.1141) * Math.log(age);
		var cAgeSq = 4.884 * Math.log(age) * Math.log(age) * (isWhite ? 1 : 0);
		var cChol = (isWhite ? 13.540 : 0.9396) * Math.log(totalCholesterol);
		var cAgeChol = -3.114 * Math.log(totalCholesterol) * Math.log(age) * (isWhite ? 1 : 0);
		var cHdl = (isWhite ? -13.578 : -18.9196) * Math.log(hdlCholesterol);
		var cAgeHdl = (isWhite ? 3.149 : 4.4748) * Math.log(age) * Math.log(hdlCholesterol);
		var cBp = (isWhite ? (treatedBp ? 2.019 : 1.957) : (treatedBp ? 29.2907 : 27.8197)) * Math.log(systolicBp);
		var cAgeBp = (treatedBp ? -6.4321 : -6.0873) * Math.log(age) * Math.log(systolicBp) * (isWhite ? 0 : 1);
		var cSmoker = (smoker ? (isWhite ? 7.574 : 0.6908) : 0.0);
		var cAgeSmoker = -1.665 * Math.log(age) * (smoker ? 1 : 0.0) * (isWhite ? 1 : 0);
		var cDiabetes = (isWhite ? 0.661 : 0.8738) * (diabetes ? 1 : 0.0);
		var sum = cAge + cAgeSq + cChol + cAgeChol + cHdl + cAgeHdl + cBp + cAgeBp + cSmoker + cAgeSmoker + cDiabetes;
		
		var exp = Math.exp(sum - (isWhite ? -29.1817 : 86.6081));
		var survival = Math.pow((isWhite ? 0.96652 : 0.95334), exp);
		var risk = 1.0 - survival;
		//alert("female Risk : "+Math.round(risk*1000.0) / 10.0);

		return Math.round(risk*1000.0) / 10.0;
	};

};