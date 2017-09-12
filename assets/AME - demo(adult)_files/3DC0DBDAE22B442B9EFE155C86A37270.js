	/* <![CDATA[ */
		$(function() {
			var input = document.createElement("input");
			if(('placeholder' in input)==false) { 
				$('[placeholder]').focus(function() {
					var i = $(this);
					if(i.val() == i.attr('placeholder')) {
						i.val('').removeClass('placeholder');			
					}
				}).blur(function() {
					var i = $(this);	
					if(i.val() == '' || i.val() == i.attr('placeholder')) {
						i.addClass('placeholder').val(i.attr('placeholder'));
					}
				}).blur().parents('form').submit(function() {
					$(this).find('[placeholder]').each(function() {
						var i = $(this);
						if(i.val() == i.attr('placeholder'))
							i.val('');
					})
				});
			}
		});
		/* ]]> */
		
		$(document).ready(function() { 
	
	$('input[name="fram_calc_sex"]').change(function() {
		$('#fram_calc_sex_tr').removeClass('text-input-error');
		$('#fram_calc_sex_error_text').hide();
	});
	
	$('select[name="fram_calc_race"]').change(function() {
		$('#fram_calc_race_tr').removeClass('text-input-error');
		$('#fram_calc_race_error_text').hide();
	});
	
	$('input[name="fram_calc_syst_bp"]').change(function() {
		$('#fram_calc_syst_bp_tr').removeClass('text-input-error');
		$('#fram_calc_syst_bp_error_text').hide();
	});
	
	$('input[name="fram_calc_age"]').change(function() {
		$('#fram_calc_age_tr').removeClass('text-input-error');
		$('#fram_calc_age_error_text').hide();
	});
	
	$('input[name="fram_calc_diabetes"]').change(function() {
		$('#fram_calc_diabetes_tr').removeClass('text-input-error');
		$('#fram_calc_diabetes_error_text').hide();
	});
	
	$('input[name="fram_calc_smoker"]').change(function() {
		$('#fram_calc_smoker_tr').removeClass('text-input-error');
		$('#fram_calc_smoker_error_text').hide();
	});
	
	$('input[name="fram_calc_hypertension"]').change(function() {
		$('#fram_calc_hypertension_tr').removeClass('text-input-error');
		$('#fram_calc_hypertension_error_text').hide();
	});
	
	$('input[name="fram_calc_total_cholesterol"]').change(function() {
		$('#fram_calc_total_cholesterol_tr').removeClass('text-input-error');
		$('#fram_calc_total_cholesterol_error_text').hide();
	});
	
	$('input[name="fram_calc_hdl"]').change(function() {
		$('#fram_calc_hdl_tr').removeClass('text-input-error');
		$('#fram_calc_hdl_error_text').hide();
	});
	
	$('.fram_risk_reset').click(function() {
		
		$('#fram_calc_sex_m').removeAttr('checked');
		$('#fram_calc_sex_f').removeAttr('checked');	
		$('#fram_calc_diabetes_n').removeAttr('checked');
		$('#fram_calc_diabetes_y').removeAttr('checked');
		$('#fram_calc_smoker_n').removeAttr('checked');
		$('#fram_calc_smoker_y').removeAttr('checked');
		$('#fram_calc_hypertension_none').removeAttr('checked');
		$('#fram_calc_hypertension_treated').removeAttr('checked');
		$('#fram_calc_hypertension_untreated').removeAttr('checked');
		$('#fram_calc_race').get(0).selectedIndex = 0;
		$('#fram_calc_syst_bp').val('');
		$('#fram_calc_age').val('');
		$('#fram_calc_total_cholesterol').val('');
		$('#fram_calc_hdl').val('');
		
		$('#fram_calc_sex_tr').removeClass('text-input-error');
		$('#fram_calc_sex_error_text').hide();
		
		$('#fram_calc_race_tr').removeClass('text-input-error');
		$('#fram_calc_race_error_text').hide();

		$('#fram_calc_syst_bp_tr').removeClass('text-input-error');
		$('#fram_calc_syst_bp_error_text').hide();

		$('#fram_calc_age_tr').removeClass('text-input-error');
		$('#fram_calc_age_error_text').hide();		

		$('#fram_calc_diabetes_tr').removeClass('text-input-error');
		$('#fram_calc_diabetes_error_text').hide();		

		$('#fram_calc_smoker_tr').removeClass('text-input-error');
		$('#fram_calc_smoker_error_text').hide();		

		$('#fram_calc_hypertension_tr').removeClass('text-input-error');
		$('#fram_calc_hypertension_error_text').hide();		

		$('#fram_calc_total_cholesterol_tr').removeClass('text-input-error');
		$('#fram_calc_total_cholesterol_error_text').hide();		

		$('#fram_calc_hdl_tr').removeClass('text-input-error');
		$('#fram_calc_hdl_error_text').hide();
			
		var name = navigator.appName;		
		if(name == "Microsoft Internet Explorer") {
			$('#fram_calc_syst_bp').addClass('placeholder').val($('#fram_calc_syst_bp').attr('placeholder'));
			$('#fram_calc_age').addClass('placeholder').val($('#fram_calc_age').attr('placeholder'));
			$('#fram_calc_total_cholesterol').addClass('placeholder').val($('#fram_calc_total_cholesterol').attr('placeholder'));
			$('#fram_calc_hdl').addClass('placeholder').val($('#fram_calc_hdl').attr('placeholder'));
		}
	});	
	
});

		var PooledCohortAha10YearRisk = new function() {

	/**
	 * Get the 10 year risk.
	 * 
	 *param age
	 *            Patient's age
	 *param sex
	 *            "Male" or "Female".
	 *param race
	 *            "White" - white or other. "Black" - african american.
	 *param systolicBp
	 *            Systolic blood pressure.
	 *param totalCholesterol
	 *            The total cholesterol.
	 *param hdlCholesterol
	 *            The HDL (good) cholesterol.
	 *param smoker
	 *            True if smoker, false if not.
	 *param treatedBp
	 *            True if treated BP, false if no treatment.
	 *param diabetes
	 *            True if diabetic, false if not.
	 *returns A JSON object with the risk percentages in the form of:
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

		/**
 * Calculates the framingham 10 year general CVD risk
 * EXAMPLE:
 * var risk = framingham10YearGeneralCvdRisk.framingham10YearRiskLipids();
 * alert("Patient's 10 year risk is: " + fr10Json.patientRisk + "%");
 * alert("Patient's 10 optimal risk is: " + fr10Json.optimalRisk + "%");
 * alert("Normal risk for a patient this age and sex is: " + fr10Json.normalRisk + "%");
 */



var framingham10YearGeneralCvdRisk = new function(){
	//
	// Funcs
	//
	// Baseline values. Need to fill in gender and age
	var baselineNormalData = {
	    gender: 0,  age: 30, sbp: 125, tcl: 180, hdl: 45, smoker: 0, diabetes: 0, trtbp: 0			
	};	
	
	var baselineOptimalData = {
	    gender: 0, age: 30, sbp: 110, tcl: 160, hdl: 60, smoker: 0, diabetes: 0, trtbp: 0		
	};
	
	var attainableData = {
		gender: 0, age: 30, sbp: 110, tcl: 160, hdl: 60, smoker: 0, diabetes: 0, trtbp: 0		
	};

	this.formDataValid = function(data)
	{
	    if ( (data['age'] > 74) || (data['age'] < 30))
	    {
	        //$('error_msg').set('text',"Age must be between 30 and 74");
	        return false;
	    }
	    
	    if ( (data['sbp'] > 200) || (data['sbp'] < 90))
	    {
	        //$('error_msg').set('text',"Systolic pressure must be between 90 and 200");
	        return false;
	    }    
	
	    if ( (data['hdl'] > 100) || (data['hdl'] < 10))
	    {
	        //$('error_msg').set('text',"HDL must be between 10 and 100");
	        return false;
	    }    

	    if ( (data['tcl'] > 405) || (data['tcl'] < 100))
	    {
	        //$('error_msg').set('text',"Total cholesterol must be between 100 and 405");
	        return false;
	    }    
	    
	    return true;
	};

	var calcBmi = function(height, mass)
	{
		bmi = 703.0814062 * mass / (height * height);
	    return bmi;   
	};
	
	this.calcRisk = function(data)
	{
		//
		// Coefficients
		// 
		var coefsMaleNoTrtbp =
		{
		    age: 3.06117, sbp: 1.93303, tcl: 1.1237, hdl: -0.93263, smoker: 0.65451, diabetes: 0.57367
		};
		
		var coefsFemaleNoTrtbp =
		{
		    age: 2.32888, sbp: 2.76157, tcl: 1.20904, hdl: -0.70833, smoker: 0.52873, diabetes: 0.69154
		};
		
		
		var coefSbpMaleTrtbp   = 1.99881; // replaces sbp coef if being treated
		var coefSbpFemaleTrtbp = 2.82263; // replaces sbp coef if being treated
		
		// Is contribution to some coef*data or coef*ln(data)?
		var useLogData =
		{
		    age: true, sbp: true, tcl: true, hdl: true, smoker: false, diabetes: false			
		};	
		
		
		// Constant term in sum
		var betaZeroMale   = -23.9802;
		var betaZeroFemale = -26.1931;	
		
		// Base for pow() calculation
		var baseMale = 0.88936;
		var baseFemale = 0.95012;
		
		// other vars
		var coefs;
		var base;
		var betaZero;
		
		if (data['gender'] == 1) // male
		{
			betaZero = betaZeroMale;
			base = baseMale;
			coefs = coefsMaleNoTrtbp;
			if (data['trtbp'] == 1)
				coefs['sbp'] = coefSbpMaleTrtbp;
		}
		else
		{
			betaZero = betaZeroFemale;
			base = baseFemale;			
			coefs = coefsFemaleNoTrtbp;		
			if (data['trtbp'] == 1)
				coefs['sbp'] = coefSbpFemaleTrtbp;			
		}

	    // do computation
	    var betaSum = betaZero;
	    for(var k in coefs)
	    {
	    	var m = parseFloat(data[k]);
	    	if (useLogData[k])
	    		m = Math.log(m);
	        var dBeta = coefs[k] * m;
	        betaSum += dBeta;
	    }
	    var risk =  1.0 - Math.pow(base, Math.exp(betaSum));
	    return risk;
	};
	
	// Binary search to find "normal" age for the given score
	this.calcHeartAge = function(riskVal, gender)
	{
        var loAge  = 10;  // no real minimum bound, but 10 is a practical one
        var hiAge = 86;          // 85 is max

      	var testAge;          
        var testData = baselineNormalData;
        testData['gender'] = gender;     
        
        // threshold should be < half of the desired accuracy (.5 in this case)
        while ( (hiAge - loAge) > .2)
        {
        	testAge = (hiAge + loAge) / 2.0;        
            testData['age'] = testAge;            	

          	var testRisk = this.calcRisk(testData);
          	
          	if (testRisk < riskVal)
          	{
          		loAge = testAge;
          	}
          	else if (testRisk > riskVal)
          	{
          		hiAge = testAge;
          	}
          	else
          	{
          		hiAge = testAge;
          		loAge = testAge;
          	}
               	
        }
        
		return testAge;	
	};

	/**
	 * Calculates the full CVD risk 
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param cholesterol
	 *            total cholesterol
	 *param hdl
	 *            high density lipoprotein
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {patientRisk:-1, normalRisk:-1, optimalRisk:-1, attainableRisk:-1, heartAge:-1};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk or heart age.
	 */
	this.framingham10YearRiskLipids = function(age, isMale, systolicBp, cholesterol, hdl, smoker, treatedBp, diabetic){
		var lclNormalData = baselineNormalData;
		var lclOptimalData = baselineOptimalData;
		var lclAttainableData = attainableData;
		// gender: 1=male,0=female
		// smoker: 0=no,1=yes
		// diabetes: 0=no,1=yes
		// trtbp: 0=no,1=yes
		var patientData = {gender: 0,  age: 30, sbp: 125, tcl: 180, hdl: 45, smoker: 0, diabetes: 0, trtbp: 0};
		var lipidRisk = {patientRisk:-1, normalRisk:-1, optimalRisk:-1, attainableRisk:-1, heartAge:-1};
		patientData.gender = isMale?1:0;
		lclNormalData.gender = patientData.gender;
		lclOptimalData.gender = patientData.gender;
		lclAttainableData.gender = patientData.gender;
		patientData.age = age;
		lclAttainableData.age = age;
		lclNormalData.age = patientData.age;
		lclOptimalData.age = patientData.age;
		patientData.diabetes = diabetic?1:0;
		lclNormalData.diabetes = patientData.diabetes;
		lclOptimalData.diabetes = patientData.diabetes;
		lclAttainableData.diabetes = patientData.diabetes;
		patientData.smoker = smoker?1:0;
		patientData.trtbp = treatedBp?1:0;
		patientData.tcl = cholesterol;
		patientData.hdl = hdl;
		patientData.sbp = systolicBp;
		if(this.formDataValid(patientData)){
			lipidRisk.patientRisk = Math.round( 100 * this.calcRisk(patientData));
			lipidRisk.normalRisk = Math.round( 100 * this.calcRisk(lclNormalData));
			lipidRisk.optimalRisk = Math.round( 100 * this.calcRisk(lclOptimalData));
			lipidRisk.attainableRisk = Math.round(100 * this.calcRisk(lclAttainableData));
			lipidRisk.heartAge = this.calcHeartAge(lipidRisk.patientRisk, patientData.gender);
		} else {
			lipidRisk.heartAge='';
			lipidRisk.normalRisk='';
			lipidRisk.optimalRisk='';
			lipidRisk.patientRisk='';
		}
		return lipidRisk;
	};
};

/*function framingham10YearRiskBMI(age, sex, diabetes, smoking, treatedBp, bmi){
	// gender: 1=male,0=female
	// smoker: 0=no,1=yes
	// diabetes: 0=no,1=yes
	// trtbp: 0=no,1=yes
	var patientData = {gender: 0,  age: 30, sbp: 125, bmi: 20, smoker: 0, diabetes: 0, trtbp: 0};
	var bmiRisk = {"patientRisk":-1, "normalRisk":-1, "optimalRisk":-1, "heartAge":-1};
	patientData.gender = sex;
	patientData.age = age;
	patientData.diabetes = diabetes;
	patientData.smoker = smoking;
	patientData.trtbp = treatedBp;
	patientData.bmi = bmi;
}*/

		/*
 * Project - CVHCWeb, Mayo Clinic Rochester
 * Created on Mar 30, 2011
 * 
 * These calculations are based on the framingham 30 year risk study located at
 * http://circ.ahajournals.org/cgi/content/short/CIRCULATIONAHA.108.816694v1 Specifically, these calculations are a
 * reverse engineering of the spreadsheet located at
 * http://circ.ahajournals.org/content/vol0/issue2009/images/data/CIRCULATIONAHA.108.816694/DC1/CI816694.DSriskcalculator.xls
 * 
 * SPECIAL NOTE:  As of 4/8/2011 there is a bug on the spreadsheet listed above regarding the normal risk scores.  These risk 
 *                scores do not take into account the difference between male/female.  This code has been updated to address
 *                this issue, however the spreadsheet may not.
 */
/*
 * Authors: Michael J. Pencina PhD, Ralph B. D'Agostino Sr PhD, Martin G. Larson ScD, Joseph M. Massaro PhD, and
 * Ramachandran S. Vasan MD.
 */
/*
 * Excel spreadsheet calculations have been translated to Java by Aaron Vaneps (Vaneps.Michael@mayo.edu), and I make no
 * guarantee that there are no bugs in the translation. Use at your own risk.
 */

	/**
	 * Calculates the full CVD risk which consists of the hard CVD risk in addition to the risk of coronary
	 * insufficiency, angina pectoris, transient ischemic attack, intermittent claudication or congestive heart failure.
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param cholesterol
	 *            total cholesterol
	 *param hdl
	 *            high density lipoprotein
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk.
	 *         
	 *         risk - the risk that the patient will have a cardiac event (as listed above) in the next 30 years
	 *         optimal risk - the risk of a patient the same age and sex as the patient given, but with absolute optimal risk factors
	 *         normal risk - the risk of your average person the same age and sex as the patient given.
	 *         attainable risk - the risk the patient given could achieve if they get all their risk factors under control.  assumes diabetes cannot be changed.
	 *         
	 *         EXAMPLE:
	 *         var patientRisk = calculateFullRiskNoBmi(55, false, 130, 255, 35, false, true, false);
	 *         alert("The average patient's risk percent is:" + patientRisk.normalRisk + "%");
	 *         alert("The patient's full risk percent is:" + patientRisk.risk + "%");
	 *         alert("The patient's optimal risk percent is:" + patientRisk.optimalRisk + "%");
	 *         alert("The patient's attainable risk percent is:" + patientRisk.attainableRisk + "%");
	 */
	function calculateFullRiskNoBmi(age, isMale, systolicBp, cholesterol, hdl, smoker, treatedBp, diabetic){
		var returnObj = {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
		returnObj.risk = calculateFullRiskNoBmiInternal( age, isMale,  systolicBp,  cholesterol,  hdl, smoker, treatedBp, diabetic);
		returnObj.optimalRisk = calculateFullRiskNoBmiInternal( age, isMale,  110, 160, 60, false, false, false);
		returnObj.normalRisk = calculateFullRiskNoBmiInternal( age, isMale,  125, 180, 45, false, false, false);
		returnObj.attainableRisk = calculateFullRiskNoBmiInternal( age, isMale,  110,  160, 60, false, false, diabetic);
		return returnObj;
	}
	
	/**
	 * Calculates the hard CVD risk which is the risk of coronary death, myocardial infarction and fatal or non-fatal
	 * stroke.
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param cholesterol
	 *            total cholesterol
	 *param hdl
	 *            high density lipoprotein
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk.
	 *         
	 *         risk - the risk that the patient will have a cardiac event (as listed above) in the next 30 years
	 *         optimal risk - the risk of a patient the same age and sex as the patient given, but with absolute optimal risk factors
	 *         normal risk - the risk of your average person the same age and sex as the patient given.
	 *         attainable risk - the risk the patient given could achieve if they get all their risk factors under control.  assumes diabetes cannot be changed.
	 *         
	 *         EXAMPLE:
	 *         var patientRisk = calculateHardRiskNoBmi(55, false, 130, 255, 35, false, true, false);
	 *         alert("The average patient's risk percent is:" + patientRisk.normalRisk + "%");
	 *         alert("The patient's hard risk percent is:" + patientRisk.risk + "%");
	 *         alert("The patient's optimal risk percent is:" + patientRisk.optimalRisk + "%");
	 *         alert("The patient's attainable risk percent is:" + patientRisk.attainableRisk + "%");
	 */
	function calculateHardRiskNoBmi( age, isMale,  systolicBp,  cholesterol,  hdl, smoker, treatedBp, diabetic) {
		var returnObj = {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
		returnObj.risk = calculateHardRiskNoBmiInternal( age, isMale,  systolicBp,  cholesterol,  hdl, smoker, treatedBp, diabetic);
		returnObj.optimalRisk = calculateHardRiskNoBmiInternal( age, isMale,  110, 160, 60, false, false, false);
		returnObj.normalRisk = calculateHardRiskNoBmiInternal( age, isMale,  125, 180, 45, false, false, false);
		returnObj.attainableRisk = calculateHardRiskNoBmiInternal( age, isMale,  110,  160, 60, false, false, diabetic);
		return returnObj;
	}
	
	/**
	 * Calculates the full CVD risk which consists of the hard CVD risk in addition to the risk of coronary
	 * insufficiency, angina pectoris, transient ischemic attack, intermittent claudication or congestive heart failure.
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *param BMI
	 *            The BMI of the patient
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk.
	 *         
	 *         risk - the risk that the patient will have a cardiac event (as listed above) in the next 30 years
	 *         optimal risk - the risk of a patient the same age and sex as the patient given, but with absolute optimal risk factors
	 *         normal risk - the risk of your average person the same age and sex as the patient given.
	 *         attainable risk - the risk the patient given could achieve if they get all their risk factors under control.  assumes diabetes cannot be changed.
	 *         
	 *         EXAMPLE:
	 *         var patientRisk = calculateFullRiskBmi(55, false, 130, false, true, false, 26.5);
	 *         alert("The average patient's BMI risk percent is:" + patientRisk.normalRisk + "%");
	 *         alert("The patient's full BMI risk percent is:" + patientRisk.risk + "%");
	 *         alert("The patient's optimal BMI risk percent is:" + patientRisk.optimalRisk + "%");
	 *         alert("The patient's attainable BMI risk percent is:" + patientRisk.attainableRisk + "%");
	 */
	function calculateFullRiskBmi( age, isMale,  systolicBp, smoker, treatedBp, diabetic, BMI){
		var returnObj = {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
		returnObj.risk = calculateFullRiskBmiInternal(age, isMale,  systolicBp, smoker, treatedBp, diabetic, BMI);
		returnObj.optimalRisk = calculateFullRiskBmiInternal(age, isMale,  110, false, false, false, 22);
		returnObj.normalRisk = calculateFullRiskBmiInternal(age, isMale,  125, false, false, false, 22.5);
		returnObj.attainableRisk = calculateFullRiskBmiInternal( age, isMale,  110,  false, false, diabetic, 22.5);
		return returnObj;
	}
	
	/**
	 * Calculates the hard CVD risk which is the risk of coronary death, myocardial infarction and fatal or non-fatal
	 * stroke.
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *param BMI
	 *            The BMI of the patient
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk.
	 *         
	 *         risk - the risk that the patient will have a cardiac event (as listed above) in the next 30 years
	 *         optimal risk - the risk of a patient the same age and sex as the patient given, but with absolute optimal risk factors
	 *         normal risk - the risk of your average person the same age and sex as the patient given.
	 *         attainable risk - the risk the patient given could achieve if they get all their risk factors under control.  assumes diabetes cannot be changed.
	 *         
	 *         EXAMPLE:
	 *         var patientRisk = calculateHardRiskBmi(55, false, 130, false, true, false, 26.5);
	 *         alert("The average patient's BMI risk percent is:" + patientRisk.normalRisk + "%");
	 *         alert("The patient's hard BMI risk percent is:" + patientRisk.risk + "%");
	 *         alert("The patient's optimal BMI risk percent is:" + patientRisk.optimalRisk + "%");
	 *         alert("The patient's attainable BMI risk percent is:" + patientRisk.attainableRisk + "%");
	 */
	function calculateHardRiskBmi( age, isMale,  systolicBp, smoker, treatedBp, diabetic, BMI){
		var returnObj = {"risk" : -1.0, "optimalRisk": -1.0, "normalRisk": -1.0, "attainableRisk": -1.0};
		returnObj.risk = calculateHardRiskBmiInternal(age, isMale,  systolicBp, smoker, treatedBp, diabetic, BMI);
		returnObj.optimalRisk = calculateHardRiskBmiInternal(age, isMale,  110, false, false, false, 22);
		returnObj.normalRisk = calculateHardRiskBmiInternal(age, isMale,  125, false, false, false, 22.5);
		returnObj.attainableRisk = calculateHardRiskBmiInternal(age, isMale,  110, false, false, diabetic, 22);
		return returnObj;
	}
	
	/**
	 * Determines how much risk the patient would remove by having various ideal risk factors.
	 * 
	 *param age
	 *            age of the patient, in years.
	 *param isMale
	 *            true if patient is male, false if female
	 *param systolicBp
	 *            systolic blood pressure
	 *param cholesterol
	 *            total cholesterol
	 *param hdl
	 *            high density lipoprotein
	 *param smoker
	 *            true if patient smokes, false if not
	 *param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 *param diabetic
	 *            true if patient is diabetic, false if not
	 *return 
	 *         A JSON object with the risk percentages in the form of:
	 *                {"systolicBp" : 5, "cholesterol": 6, "hdl": 3, "smoking": 4};
	 *         Note that -1 means something went wrong, otherwise it will be the percent risk.
	 */
	function getIdealHardRiskFactors(age, isMale, systolicBp, cholesterol, hdl, smoker, treatedBp, diabetic){
		//TODO implement this
	}

	
	/**
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!                    INTERNAL FUNCTIONS:
	 * !!!!!!!!!!!!!!!!!!!!!!  NOT INTENDED FOR USE OUTSIDE OF THIS MODULE
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 * !!!!!!!!!!!!!!!!!!!!!!
	 */
	function calculateFullRiskNoBmiInternal(age, isMale, systolicBp, cholesterol, hdl, smoker, treatedBp, diabetic) {
		var i=0; // loop invariant
		var E = [ 0.999874296, 0.999874296, 0.999874296, 0.999748519, 0.999622704, 0.999622704, 0.999496803,
				0.999370849, 0.999370849, 0.999370849, 0.999244705, 0.999244705, 0.99911853, 0.99911853, 0.99911853,
				0.998992174, 0.998865757, 0.998739283, 0.998612704, 0.998612704, 0.998612704, 0.998486005, 0.998359261,
				0.998232504, 0.998105675, 0.997978839, 0.997851933, 0.997851933, 0.997851933, 0.997724749, 0.997597515,
				0.997470181, 0.997342824, 0.997342824, 0.997215427, 0.997215427, 0.997087879, 0.996960256, 0.996960256,
				0.996960256, 0.996960256, 0.996832045, 0.996703795, 0.996575514, 0.996447164, 0.996318743, 0.996318743,
				0.996190148, 0.996061122, 0.995932052, 0.995802901, 0.995673626, 0.995544206, 0.995414666, 0.995284937,
				0.99515505, 0.995025081, 0.995025081, 0.995025081, 0.994894865, 0.994764513, 0.994634039, 0.994503411,
				0.994503411, 0.994503411, 0.994372668, 0.994241919, 0.994110783, 0.993979643, 0.99384838, 0.993717032,
				0.99358538, 0.993453732, 0.993322039, 0.993190335, 0.993058573, 0.992926616, 0.992794617, 0.992662602,
				0.992530547, 0.992398482, 0.992266422, 0.99213433, 0.992002235, 0.991870046, 0.991737769, 0.991605443,
				0.991473096, 0.991340627, 0.991208044, 0.991075452, 0.990942808, 0.990810007, 0.990677101, 0.990544031,
				0.99041084, 0.990277491, 0.990144063, 0.990010525, 0.989877001, 0.989743334, 0.989609467, 0.989475554,
				0.989341599, 0.989207647, 0.989073673, 0.988939555, 0.988805391, 0.988671231, 0.988671231, 0.988537062,
				0.988402883, 0.988268691, 0.988134423, 0.988000123, 0.987865777, 0.987731408, 0.987596881, 0.98746234,
				0.987327798, 0.987193229, 0.987058645, 0.986924022, 0.986789375, 0.986654394, 0.986519398, 0.986384286,
				0.986384286, 0.986249068, 0.986113843, 0.986113843, 0.985978289, 0.985978289, 0.985978289, 0.985842542,
				0.985706568, 0.985570488, 0.985434336, 0.985297906, 0.985297906, 0.985161383, 0.985024827, 0.984888162,
				0.984751508, 0.984614825, 0.98447809, 0.984341371, 0.984341371, 0.984204554, 0.984067557, 0.983930384,
				0.983930384, 0.983793063, 0.983655684, 0.983518256, 0.983380646, 0.983242918, 0.983105116, 0.982967179,
				0.982967179, 0.982967179, 0.982967179, 0.982967179, 0.982828783, 0.982690349, 0.982551894, 0.982412785,
				0.982273637, 0.982134487, 0.981995136, 0.981855744, 0.981716262, 0.981576767, 0.981576767, 0.981576767,
				0.981576767, 0.981437115, 0.981437115, 0.981297367, 0.981157515, 0.981017606, 0.980877662, 0.980737695,
				0.980597721, 0.980457516, 0.980317278, 0.980317278, 0.980176964, 0.98003653, 0.979896053, 0.979755489,
				0.979614885, 0.979474273, 0.979333587, 0.979192752, 0.979051888, 0.978910968, 0.978769968, 0.978628829,
				0.978628829, 0.978628829, 0.978487594, 0.978346298, 0.978346298, 0.978204743, 0.978204743, 0.978062894,
				0.978062894, 0.977920908, 0.977778907, 0.977778907, 0.977636652, 0.977494371, 0.977352026, 0.977352026,
				0.977209622, 0.977066907, 0.976924135, 0.976924135, 0.976781251, 0.97663828, 0.976495262, 0.976352089,
				0.976208855, 0.976065627, 0.976065627, 0.975922003, 0.975778365, 0.975634644, 0.975490766, 0.975346853,
				0.975202466, 0.975202466, 0.975057997, 0.974913545, 0.974769045, 0.974624521, 0.974624521, 0.974479884,
				0.974335227, 0.974335227, 0.974190549, 0.974190549, 0.974190549, 0.974045614, 0.973900631, 0.973755587,
				0.973610487, 0.973465252, 0.973465252, 0.973465252, 0.973319553, 0.973173871, 0.973028141, 0.9728824,
				0.9728824, 0.972736535, 0.972736535, 0.972590658, 0.972444751, 0.972298724, 0.972152695, 0.972006611,
				0.971860537, 0.971714419, 0.971568153, 0.971421695, 0.971275181, 0.971128648, 0.970982126, 0.970835606,
				0.970835606, 0.97068888, 0.970542117, 0.970395279, 0.970395279, 0.970395279, 0.970248233, 0.970101034,
				0.969953813, 0.969806594, 0.969659159, 0.969511667, 0.969511667, 0.969364022, 0.969364022, 0.969216258,
				0.969068343, 0.968920351, 0.968772291, 0.968772291, 0.968624043, 0.968475778, 0.968327498, 0.968179149,
				0.968030784, 0.967882356, 0.967882356, 0.967733771, 0.96758498, 0.967436187, 0.967287403, 0.967287403,
				0.967138554, 0.966989689, 0.966840812, 0.966691942, 0.966543078, 0.966394154, 0.966245095, 0.966095981,
				0.965946816, 0.965797602, 0.965648227, 0.965498855, 0.965349408, 0.965349408, 0.965349408, 0.965199718,
				0.965050012, 0.965050012, 0.964900264, 0.964900264, 0.964750366, 0.964600352, 0.964450344, 0.964300261,
				0.964300261, 0.964149989, 0.963999688, 0.963849367, 0.963698908, 0.963548398, 0.963548398, 0.96339782,
				0.96339782, 0.963247188, 0.963096443, 0.963096443, 0.962945659, 0.962945659, 0.962945659, 0.962794662,
				0.962643638, 0.962492525, 0.962492525, 0.962341371, 0.962190203, 0.962039023, 0.961887771, 0.961736518,
				0.961585269, 0.961585269, 0.961433927, 0.961433927, 0.961282421, 0.961130891, 0.960979285, 0.960979285,
				0.960827614, 0.960675856, 0.960524041, 0.960524041, 0.960524041, 0.960372039, 0.960219955, 0.960219955,
				0.96006774, 0.959915468, 0.959763116, 0.959610664, 0.959458171, 0.959458171, 0.959305516, 0.959305516,
				0.959152768, 0.959152768, 0.958999926, 0.958847066, 0.958694091, 0.958541094, 0.958388101, 0.958388101,
				0.958234856, 0.958234856, 0.958081437, 0.958081437, 0.957927899, 0.957774117, 0.957774117, 0.957774117,
				0.95762008, 0.957466054, 0.957466054, 0.957311767, 0.957157467, 0.957003047, 0.956848629, 0.95669398,
				0.956539186, 0.956539186, 0.956539186, 0.956384152, 0.956384152, 0.956228946, 0.956073689, 0.955918444,
				0.955763108, 0.955607463, 0.955607463, 0.955451746, 0.95529599, 0.95529599, 0.95529599, 0.955139997,
				0.954983898, 0.954983898, 0.954983898, 0.954827682, 0.95467124, 0.95467124, 0.95467124, 0.954514566,
				0.954357871, 0.954201081, 0.954044289, 0.953887436, 0.953730557, 0.953573636, 0.953573636, 0.953416489,
				0.953416489, 0.953259332, 0.953102147, 0.95294493, 0.95294493, 0.952787098, 0.952787098, 0.952787098,
				0.95262901, 0.952470904, 0.952470904, 0.952312712, 0.952154381, 0.952154381, 0.951995979, 0.951837124,
				0.951678243, 0.951519262, 0.951360094, 0.951200825, 0.951041322, 0.951041322, 0.950881796, 0.950722283,
				0.950562708, 0.950403016, 0.950243224, 0.950083389, 0.949923468, 0.949763514, 0.949603492, 0.949443324,
				0.949283138, 0.949283138, 0.949122859, 0.948962447, 0.948962447, 0.948962447, 0.948801463, 0.948801463,
				0.948801463, 0.948801463, 0.948640018, 0.9484783, 0.948316452, 0.948154508, 0.947992378, 0.947830268,
				0.947668157, 0.947506027, 0.947343857, 0.947181604, 0.947181604, 0.947181604, 0.947019218, 0.946856719,
				0.946694133, 0.946531507, 0.946368822, 0.946206111, 0.946206111, 0.946043173, 0.945880246, 0.945880246,
				0.945717253, 0.945554279, 0.945391222, 0.945391222, 0.945391222, 0.94522795, 0.94522795, 0.94506463,
				0.94506463, 0.944901254, 0.944737448, 0.944737448, 0.944737448, 0.944573344, 0.944409121, 0.944244735,
				0.944080355, 0.944080355, 0.943915684, 0.943750882, 0.943586066, 0.943421226, 0.94325639, 0.94325639,
				0.943091276, 0.94292615, 0.94276104, 0.94276104, 0.942595815, 0.942430592, 0.942265238, 0.942265238,
				0.942265238, 0.942265238, 0.942098959, 0.941932557, 0.941765837, 0.941599089, 0.941432347, 0.941432347,
				0.941265422, 0.94109848, 0.940931478, 0.94076443, 0.94059739, 0.940430182, 0.940430182, 0.94026287,
				0.940095474, 0.940095474, 0.939927979, 0.939760479, 0.939592951, 0.939592951, 0.939592951, 0.939425277,
				0.939257533, 0.939089674, 0.939089674, 0.938921714, 0.938753565, 0.938753565, 0.938585394, 0.938585394,
				0.938417032, 0.938248634, 0.938248634, 0.938079961, 0.938079961, 0.938079961, 0.938079961, 0.937911071,
				0.937742136, 0.937742136, 0.93757305, 0.937403973, 0.937403973, 0.937234802, 0.937234802, 0.937065446,
				0.937065446, 0.936895925, 0.936895925, 0.936726281, 0.936556554, 0.936556554, 0.936556554, 0.936556554,
				0.936556554, 0.936386333, 0.936386333, 0.936215834, 0.936215834, 0.936045215, 0.936045215, 0.936045215,
				0.935874349, 0.935703428, 0.935532411, 0.935361239, 0.935361239, 0.93518953, 0.935017742, 0.934845766,
				0.9346738, 0.934501798, 0.934501798, 0.934329615, 0.934157337, 0.933984956, 0.93381257, 0.93381257,
				0.933640143, 0.933467678, 0.93329518, 0.933122656, 0.932950062, 0.932777266, 0.932604444, 0.932431572,
				0.93225867, 0.932085681, 0.931912703, 0.931739719, 0.931739719, 0.931566341, 0.931392848, 0.931219264,
				0.931045673, 0.931045673, 0.930872022, 0.930698337, 0.930524646, 0.930350819, 0.930176954, 0.930003027,
				0.930003027, 0.930003027, 0.930003027, 0.929828639, 0.929828639, 0.929828639, 0.929828639, 0.929652749,
				0.929652749, 0.929476694, 0.929476694, 0.929476694, 0.929300451, 0.929124189, 0.928947889, 0.928771582,
				0.928595204, 0.928418663, 0.928242028, 0.928242028, 0.928065115, 0.927888069, 0.927888069, 0.92771081,
				0.927533551, 0.927356318, 0.927179096, 0.927001895, 0.926824608, 0.926646967, 0.926469337, 0.926469337,
				0.92629152, 0.926113674, 0.925935725, 0.925757649, 0.925757649, 0.925578986, 0.925400302, 0.925221537,
				0.925042706, 0.924863552, 0.924684358, 0.924684358, 0.924504938, 0.924325533, 0.924146117, 0.923966608,
				0.923787088, 0.923607551, 0.923427979, 0.9232484, 0.9232484, 0.92306866, 0.922888846, 0.922888846,
				0.922708672, 0.922528268, 0.922347876, 0.922167375, 0.922167375, 0.921986856, 0.921806159, 0.921806159,
				0.921806159, 0.92162507, 0.92162507, 0.92162507, 0.92162507, 0.92162507, 0.921443234, 0.921261361,
				0.921079197, 0.921079197, 0.920896783, 0.920896783, 0.920896783, 0.920896783, 0.920713653, 0.920713653,
				0.920713653, 0.920530377, 0.920346958, 0.920346958, 0.920346958, 0.920346958, 0.920163166, 0.920163166,
				0.919979081, 0.919795018, 0.919795018, 0.919609774, 0.919609774, 0.919424428, 0.919239076, 0.919053671,
				0.918868201, 0.918682752, 0.918682752, 0.918682752, 0.918682752, 0.918682752, 0.918497039, 0.918497039,
				0.918497039, 0.918497039, 0.918497039, 0.9183108, 0.91812455, 0.91812455, 0.91812455, 0.917937621,
				0.917750694, 0.917563749, 0.917376753, 0.917189711, 0.917189711, 0.917002559, 0.917002559, 0.916815366,
				0.916815366, 0.916815366, 0.916627824, 0.916627824, 0.916440088, 0.916252234, 0.916064351, 0.916064351,
				0.915876269, 0.915876269, 0.915688078, 0.915688078, 0.915499827, 0.915311568, 0.915123275, 0.915123275,
				0.915123275, 0.914934867, 0.914746463, 0.914558022, 0.914369586, 0.914369586, 0.914180977, 0.913992315,
				0.913803603, 0.913614851, 0.913426069, 0.913426069, 0.913237126, 0.913237126, 0.913047569, 0.912857865,
				0.912857865, 0.91266803, 0.91266803, 0.91266803, 0.912477752, 0.912287388, 0.912096627, 0.911905882,
				0.911714997, 0.911714997, 0.911714997, 0.911714997, 0.911524024, 0.911332997, 0.911141857, 0.911141857,
				0.910950685, 0.910759508, 0.910759508, 0.910568264, 0.910568264, 0.910568264, 0.910568264, 0.910376674,
				0.910184975, 0.909993113, 0.909993113, 0.909800823, 0.909608489, 0.909416163, 0.909223778, 0.909031271,
				0.908838765, 0.908646183, 0.908453521, 0.908453521, 0.908453521, 0.908260642, 0.908260642, 0.908067664,
				0.907874683, 0.907681695, 0.907488697, 0.907295651, 0.907102553, 0.906909453, 0.906716241, 0.906523016,
				0.906523016, 0.90632935, 0.90632935, 0.906135437, 0.906135437, 0.90594136, 0.90594136, 0.905746952,
				0.905552539, 0.905358072, 0.905358072, 0.905358072, 0.905163472, 0.904968846, 0.904774128, 0.904579394,
				0.904579394, 0.9043846, 0.904189751, 0.903994798, 0.903799878, 0.903604956, 0.903409939, 0.903409939,
				0.903409939, 0.903409939, 0.903409939, 0.903213881, 0.903017815, 0.903017815, 0.903017815, 0.902820915,
				0.902820915, 0.902624009, 0.902427131, 0.902230219, 0.902230219, 0.902230219, 0.902033088, 0.901835698,
				0.901638213, 0.901440706, 0.901243196, 0.901045538, 0.900847777, 0.900649884, 0.900452019, 0.900452019,
				0.900254121, 0.900254121, 0.900055613, 0.900055613, 0.899857064, 0.89965846, 0.89965846, 0.89965846,
				0.89965846, 0.899459566, 0.899260645, 0.899260645, 0.899061532, 0.898862287, 0.898662896, 0.898463488,
				0.898264076, 0.898264076, 0.898264076, 0.898064172, 0.897864135, 0.897663991, 0.897463781, 0.897263576,
				0.897263576, 0.897063234, 0.896862904, 0.896862904, 0.896862904, 0.896662148, 0.896662148, 0.896461137,
				0.896260064, 0.896058867, 0.895857675, 0.895857675, 0.895656406, 0.895656406, 0.895455126, 0.895253674,
				0.895052019, 0.894850224, 0.894850224, 0.894648221, 0.894446117, 0.894243613, 0.894243613, 0.894040779,
				0.893837918, 0.893634982, 0.893431979, 0.89322866, 0.893025341, 0.893025341, 0.893025341, 0.893025341,
				0.892821584, 0.892821584, 0.892617657, 0.89241359, 0.892209494, 0.892005322, 0.891801121, 0.891596892,
				0.891596892, 0.891392109, 0.891392109, 0.891187281, 0.890982391, 0.890982391, 0.890777347, 0.890572209,
				0.890572209, 0.890366852, 0.890161347, 0.890161347, 0.889955602, 0.889955602, 0.889749803, 0.889749803,
				0.889543939, 0.889543939, 0.889337758, 0.889337758, 0.889131262, 0.888924724, 0.888924724, 0.888717971,
				0.888511135, 0.888511135, 0.888304099, 0.888097049, 0.887890021, 0.887683001, 0.887475902, 0.887268644,
				0.887268644, 0.887060923, 0.886852859, 0.886644717, 0.886644717, 0.886436368, 0.886227689, 0.886018586,
				0.885809417, 0.885600209, 0.885390993, 0.885390993, 0.885390993, 0.885390993, 0.885390993, 0.885390993,
				0.885181294, 0.884971544, 0.884971544, 0.884761771, 0.884551852, 0.884341684, 0.884131463, 0.884131463,
				0.884131463, 0.883920966, 0.883920966, 0.883710289, 0.883499612, 0.883288923, 0.883288923, 0.883288923,
				0.883077797, 0.882866575, 0.882655217, 0.882655217, 0.882655217, 0.882443692, 0.882443692, 0.882232127,
				0.882020582, 0.881809046, 0.881809046, 0.881597278, 0.881597278, 0.881597278, 0.881597278, 0.881385332,
				0.881385332, 0.881173244, 0.881173244, 0.880960961, 0.880748449, 0.880535932, 0.880323455, 0.880323455,
				0.880110897, 0.879898298, 0.879685403, 0.879472504, 0.879259551, 0.879046597, 0.879046597, 0.878833583,
				0.878620435, 0.878620435, 0.878407089, 0.878193528, 0.87797989, 0.87797989, 0.877766106, 0.877766106,
				0.877552255, 0.877338394, 0.877124474, 0.876910584, 0.876910584, 0.876696386, 0.876482236, 0.876482236,
				0.876267949, 0.876267949, 0.876267949, 0.876052993, 0.876052993, 0.876052993, 0.875837798, 0.875622469,
				0.875406998, 0.87519146, 0.874975701, 0.8747599, 0.8747599, 0.874543657, 0.874543657, 0.874543657,
				0.874327144, 0.874327144, 0.874327144, 0.874110084, 0.873892955, 0.873675807, 0.873458517, 0.873458517,
				0.873240987, 0.873240987, 0.873023302, 0.872805522, 0.872587648, 0.872587648, 0.872587648, 0.872587648,
				0.872368834, 0.872150049, 0.872150049, 0.872150049, 0.871931106, 0.871712197, 0.871712197, 0.871493218,
				0.871274064, 0.871054596, 0.871054596, 0.8708348, 0.8708348, 0.870614949, 0.870614949, 0.870394773,
				0.870174574, 0.869954291, 0.869954291, 0.86973362, 0.869512979, 0.869512979, 0.86929231, 0.869071343,
				0.868850261, 0.86862915, 0.868407512, 0.868185836, 0.867964037, 0.867742082, 0.867520172, 0.867298213,
				0.867298213, 0.867298213, 0.867075628, 0.866852697, 0.866852697, 0.866629677, 0.866406566, 0.866183424,
				0.866183424, 0.865960023, 0.865960023, 0.865960023, 0.865736148, 0.865736148, 0.865736148, 0.865512062,
				0.865512062, 0.865512062, 0.865287049, 0.865062002, 0.864836735, 0.864611487, 0.864611487, 0.864385729,
				0.864385729, 0.864385729, 0.86415976, 0.863933685, 0.863707555, 0.86348119, 0.863254855, 0.863254855,
				0.863254855, 0.863028284, 0.862801682, 0.862575048, 0.862575048, 0.862347989, 0.86212096, 0.861893882,
				0.861666802, 0.861439573, 0.861212112, 0.861212112, 0.861212112, 0.861212112, 0.861212112, 0.861212112,
				0.861212112, 0.860982893, 0.860753706, 0.860524541, 0.860295372, 0.860295372, 0.860065978, 0.860065978,
				0.859836596, 0.859607114, 0.859377453, 0.859147699, 0.859147699, 0.859147699, 0.858917365, 0.858687072,
				0.858456798, 0.858226511, 0.858226511, 0.858226511, 0.858226511, 0.858226511, 0.857995176, 0.857995176,
				0.857995176, 0.857995176, 0.857763435, 0.857763435, 0.857531462, 0.857531462, 0.857299304, 0.857299304,
				0.857299304, 0.857066579, 0.85683364, 0.85683364, 0.856600282, 0.856600282, 0.856600282, 0.856366617,
				0.856366617, 0.856366617, 0.856132586, 0.856132586, 0.855898226, 0.85566377, 0.855429129, 0.855194455,
				0.855194455, 0.854959606, 0.854959606, 0.854724719, 0.854489206, 0.854253516, 0.854017711, 0.853781849,
				0.853545799, 0.853545799, 0.853309622, 0.853073431, 0.852837286, 0.852600667, 0.852363798, 0.852363798,
				0.852363798, 0.852126598, 0.852126598, 0.851889371, 0.851889371, 0.851652044, 0.851414353, 0.851414353,
				0.851414353, 0.85117647, 0.850938153, 0.850699695, 0.850460943, 0.850222188, 0.850222188, 0.850222188,
				0.850222188, 0.850222188, 0.849982036, 0.849982036, 0.849982036, 0.849740747, 0.849499468, 0.849499468,
				0.849257957, 0.849016442, 0.848774496, 0.848774496, 0.848774496, 0.848531656, 0.848288833, 0.848045654,
				0.848045654, 0.847802116, 0.847802116, 0.847802116, 0.84755819, 0.84731423, 0.84731423, 0.84731423,
				0.847070074, 0.846825718, 0.846825718, 0.846581211, 0.846336635, 0.846336635, 0.846091775, 0.845846899,
				0.845601658, 0.845356466, 0.845356466, 0.845110502, 0.844864403, 0.844618154, 0.844371932, 0.844125718,
				0.844125718, 0.843879323, 0.843879323, 0.843632735, 0.843386015, 0.84313927, 0.842892503, 0.842645168,
				0.842397757, 0.842397757, 0.842397757, 0.842149869, 0.842149869, 0.842149869, 0.841901255, 0.841901255,
				0.841901255, 0.841651628, 0.841651628, 0.8414013, 0.841150794, 0.840899408, 0.840647476, 0.840395289,
				0.840142876, 0.839890232, 0.839890232, 0.839890232, 0.839890232, 0.83963548, 0.83963548, 0.839380292,
				0.839380292, 0.839124777, 0.838869302, 0.838869302, 0.838869302, 0.838869302, 0.838612298, 0.838354766,
				0.838354766, 0.838354766, 0.838354766, 0.838095497, 0.838095497, 0.837835339, 0.837835339, 0.837574313,
				0.837574313, 0.837312793, 0.837312793, 0.837312793, 0.837312793 ];
		var J = [ 1, 0.999874446, 0.999748865, 0.999748865, 0.999748865, 0.999623134, 0.999623134, 0.999623134,
				0.999497251, 0.999371268, 0.999371268, 0.9992452, 0.9992452, 0.999119087, 0.998992881, 0.998992881,
				0.998992881, 0.998992881, 0.998992881, 0.998866203, 0.998739535, 0.998739535, 0.998739535, 0.998739535,
				0.998739535, 0.998739535, 0.998739535, 0.998612524, 0.998485376, 0.998485376, 0.998485376, 0.998485376,
				0.998485376, 0.998357988, 0.998357988, 0.998230522, 0.998230522, 0.998230522, 0.99810285, 0.997974895,
				0.997846947, 0.997846947, 0.997846947, 0.997846947, 0.997846947, 0.997846947, 0.997718564, 0.997718564,
				0.997718564, 0.997718564, 0.997718564, 0.997718564, 0.997718564, 0.997718564, 0.997718564, 0.997718564,
				0.997718564, 0.997588854, 0.997459127, 0.997459127, 0.997459127, 0.997459127, 0.997459127, 0.997328722,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313,
				0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997198313, 0.997064238, 0.997064238, 0.997064238,
				0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238,
				0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.997064238, 0.996929035,
				0.996929035, 0.996929035, 0.996793696, 0.996793696, 0.996658004, 0.996522198, 0.996522198, 0.996522198,
				0.996522198, 0.996522198, 0.996522198, 0.996385463, 0.996385463, 0.996385463, 0.996385463, 0.996385463,
				0.996385463, 0.996385463, 0.996385463, 0.996248477, 0.996248477, 0.996248477, 0.996248477, 0.996111222,
				0.996111222, 0.996111222, 0.996111222, 0.996111222, 0.996111222, 0.996111222, 0.996111222, 0.99597303,
				0.995834834, 0.995696584, 0.995558221, 0.995558221, 0.995558221, 0.995558221, 0.995558221, 0.995558221,
				0.995558221, 0.995558221, 0.995558221, 0.995558221, 0.995558221, 0.995418982, 0.995279727, 0.995140439,
				0.995140439, 0.995001025, 0.995001025, 0.995001025, 0.995001025, 0.995001025, 0.995001025, 0.995001025,
				0.995001025, 0.995001025, 0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994861076,
				0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994861076, 0.994720088,
				0.994579115, 0.994579115, 0.994579115, 0.994437815, 0.994437815, 0.994296454, 0.994296454, 0.9941548,
				0.9941548, 0.9941548, 0.994012805, 0.994012805, 0.994012805, 0.994012805, 0.993870559, 0.993870559,
				0.993870559, 0.993870559, 0.993727889, 0.993727889, 0.993727889, 0.993727889, 0.993727889, 0.993727889,
				0.993727889, 0.99358467, 0.99358467, 0.99358467, 0.99358467, 0.99358467, 0.99358467, 0.99358467,
				0.993440487, 0.993440487, 0.993440487, 0.993440487, 0.993440487, 0.993296187, 0.993296187, 0.993296187,
				0.993151759, 0.993151759, 0.993007258, 0.992862583, 0.992862583, 0.992862583, 0.992862583, 0.992862583,
				0.992862583, 0.992717442, 0.992571828, 0.992571828, 0.992571828, 0.992571828, 0.992571828, 0.992425943,
				0.992425943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943,
				0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992279943, 0.992133146,
				0.992133146, 0.992133146, 0.992133146, 0.991986093, 0.991838991, 0.991838991, 0.991838991, 0.991838991,
				0.991838991, 0.991838991, 0.991838991, 0.991691343, 0.991691343, 0.991543489, 0.991543489, 0.991543489,
				0.991543489, 0.991543489, 0.991395157, 0.991395157, 0.991395157, 0.991395157, 0.991395157, 0.991395157,
				0.991395157, 0.99124619, 0.99124619, 0.99124619, 0.99124619, 0.99124619, 0.991096646, 0.991096646,
				0.991096646, 0.991096646, 0.991096646, 0.991096646, 0.991096646, 0.991096646, 0.991096646, 0.991096646,
				0.991096646, 0.991096646, 0.991096646, 0.991096646, 0.990946141, 0.990795565, 0.990795565, 0.990795565,
				0.990644811, 0.990644811, 0.990494032, 0.990494032, 0.990494032, 0.990494032, 0.990494032, 0.990342859,
				0.990342859, 0.990342859, 0.990342859, 0.990342859, 0.990342859, 0.990191349, 0.990191349, 0.990039739,
				0.990039739, 0.990039739, 0.989887945, 0.989887945, 0.989736103, 0.989584273, 0.989584273, 0.989584273,
				0.989584273, 0.989432141, 0.989432141, 0.989432141, 0.989432141, 0.989432141, 0.989432141, 0.989432141,
				0.989279712, 0.989279712, 0.989127204, 0.989127204, 0.989127204, 0.989127204, 0.988974423, 0.988974423,
				0.988974423, 0.988974423, 0.988821336, 0.988668143, 0.988668143, 0.988668143, 0.988514805, 0.988514805,
				0.988514805, 0.988514805, 0.988514805, 0.988514805, 0.988360876, 0.988360876, 0.988206737, 0.988206737,
				0.988052415, 0.988052415, 0.988052415, 0.988052415, 0.988052415, 0.988052415, 0.987897673, 0.987897673,
				0.987742785, 0.987742785, 0.987587711, 0.987587711, 0.987587711, 0.987431977, 0.987276179, 0.987276179,
				0.987276179, 0.987120078, 0.987120078, 0.987120078, 0.987120078, 0.987120078, 0.987120078, 0.987120078,
				0.986963378, 0.986806671, 0.986806671, 0.986649751, 0.986649751, 0.986649751, 0.986649751, 0.986649751,
				0.986649751, 0.986491864, 0.986491864, 0.986491864, 0.986333708, 0.986175447, 0.986175447, 0.986175447,
				0.986016981, 0.985858436, 0.985858436, 0.985858436, 0.985699689, 0.985540838, 0.985540838, 0.985540838,
				0.985540838, 0.985540838, 0.985540838, 0.985540838, 0.985540838, 0.98538154, 0.98538154, 0.985222124,
				0.985222124, 0.985222124, 0.985222124, 0.985062358, 0.985062358, 0.984902366, 0.984742339, 0.984742339,
				0.984742339, 0.984582229, 0.984582229, 0.984582229, 0.984421909, 0.984421909, 0.984421909, 0.984421909,
				0.984421909, 0.984421909, 0.984421909, 0.984421909, 0.984259986, 0.984259986, 0.984259986, 0.984259986,
				0.984259986, 0.984259986, 0.984259986, 0.984259986, 0.984259986, 0.984259986, 0.984259986, 0.984259986,
				0.98409695, 0.98409695, 0.98409695, 0.983933535, 0.98376996, 0.98376996, 0.983606107, 0.983442194,
				0.983278228, 0.983278228, 0.983278228, 0.983278228, 0.983278228, 0.983278228, 0.983278228, 0.983278228,
				0.983278228, 0.983278228, 0.983278228, 0.983113004, 0.982947774, 0.982947774, 0.982947774, 0.982947774,
				0.982947774, 0.982947774, 0.982947774, 0.982781856, 0.982781856, 0.982781856, 0.982615818, 0.982615818,
				0.982615818, 0.982615818, 0.982449571, 0.982283314, 0.982283314, 0.982116959, 0.982116959, 0.981950557,
				0.981950557, 0.981950557, 0.981783809, 0.981616841, 0.981616841, 0.981616841, 0.981616841, 0.981616841,
				0.981449099, 0.981449099, 0.981449099, 0.981449099, 0.981449099, 0.981449099, 0.981280862, 0.981280862,
				0.981280862, 0.981280862, 0.98111221, 0.98111221, 0.98111221, 0.98111221, 0.980943124, 0.980773928,
				0.980604674, 0.980604674, 0.980604674, 0.980604674, 0.980604674, 0.980604674, 0.980434768, 0.980434768,
				0.980434768, 0.980434768, 0.980434768, 0.980434768, 0.980434768, 0.980264418, 0.980264418, 0.980264418,
				0.980093896, 0.980093896, 0.980093896, 0.980093896, 0.979923115, 0.979752338, 0.979752338, 0.979752338,
				0.979752338, 0.97958123, 0.97958123, 0.97958123, 0.979409962, 0.979409962, 0.979238546, 0.979238546,
				0.979238546, 0.979066823, 0.979066823, 0.978894732, 0.978722655, 0.978550582, 0.978550582, 0.978550582,
				0.978378325, 0.978378325, 0.978378325, 0.978206037, 0.978206037, 0.978033489, 0.978033489, 0.977860739,
				0.977860739, 0.977687929, 0.977687929, 0.977687929, 0.977514828, 0.977341681, 0.977168541, 0.976995316,
				0.976995316, 0.976821653, 0.976821653, 0.976647876, 0.976647876, 0.976473881, 0.976299881, 0.976299881,
				0.976299881, 0.976299881, 0.976299881, 0.97612507, 0.97612507, 0.97612507, 0.97612507, 0.97612507,
				0.97612507, 0.975949811, 0.975949811, 0.975949811, 0.975949811, 0.975949811, 0.975774192, 0.975774192,
				0.975774192, 0.975774192, 0.975774192, 0.975774192, 0.975774192, 0.975774192, 0.975774192, 0.975774192,
				0.975774192, 0.975774192, 0.975774192, 0.975597025, 0.975597025, 0.975597025, 0.975597025, 0.975597025,
				0.975419464, 0.975419464, 0.975419464, 0.975419464, 0.975419464, 0.975419464, 0.975419464, 0.975241279,
				0.97506285, 0.974884412, 0.974884412, 0.974705183, 0.974525779, 0.974346036, 0.974346036, 0.974166058,
				0.974166058, 0.973985978, 0.973805892, 0.973805892, 0.973805892, 0.973805892, 0.973805892, 0.973805892,
				0.973805892, 0.973805892, 0.973624804, 0.973624804, 0.973624804, 0.973443533, 0.973443533, 0.973443533,
				0.973443533, 0.973443533, 0.973443533, 0.973443533, 0.973443533, 0.973443533, 0.973261196, 0.973261196,
				0.973261196, 0.973261196, 0.973261196, 0.973077915, 0.973077915, 0.973077915, 0.973077915, 0.973077915,
				0.973077915, 0.973077915, 0.972893467, 0.972893467, 0.972893467, 0.972893467, 0.972893467, 0.972893467,
				0.972893467, 0.972893467, 0.972893467, 0.972708531, 0.972708531, 0.972708531, 0.972523005, 0.972523005,
				0.972523005, 0.972523005, 0.972523005, 0.972337159, 0.972337159, 0.972337159, 0.972151053, 0.971964795,
				0.971964795, 0.971778277, 0.97159176, 0.971405055, 0.97121817, 0.97121817, 0.97121817, 0.97121817,
				0.971030539, 0.971030539, 0.970842602, 0.970654352, 0.970466015, 0.970466015, 0.970277437, 0.970088742,
				0.970088742, 0.970088742, 0.969899877, 0.969710995, 0.969522042, 0.969522042, 0.969332687, 0.969332687,
				0.969332687, 0.96914297, 0.96914297, 0.968952631, 0.968952631, 0.968952631, 0.968952631, 0.968952631,
				0.968952631, 0.968761902, 0.968571196, 0.968380452, 0.968189699, 0.968189699, 0.96799888, 0.967808063,
				0.967617117, 0.96742616, 0.96742616, 0.96742616, 0.967234784, 0.967043239, 0.967043239, 0.967043239,
				0.967043239, 0.967043239, 0.967043239, 0.966851234, 0.966851234, 0.966659048, 0.966659048, 0.966466853,
				0.966274658, 0.966274658, 0.96608215, 0.96608215, 0.96608215, 0.96608215, 0.965889231, 0.965889231,
				0.965696071, 0.965696071, 0.965502857, 0.965502857, 0.965502857, 0.965502857, 0.965309494, 0.965116135,
				0.965116135, 0.965116135, 0.965116135, 0.965116135, 0.964922428, 0.964922428, 0.964922428, 0.964922428,
				0.964922428, 0.964922428, 0.964728309, 0.964728309, 0.964534053, 0.964534053, 0.964534053, 0.964339069,
				0.964339069, 0.964143914, 0.963948478, 0.963948478, 0.963948478, 0.963948478, 0.963948478, 0.963948478,
				0.963751942, 0.963555389, 0.963358867, 0.963358867, 0.963358867, 0.963358867, 0.963162087, 0.963162087,
				0.963162087, 0.962965283, 0.962965283, 0.962768304, 0.962571324, 0.96237436, 0.96237436, 0.96237436,
				0.96237436, 0.96217668, 0.96217668, 0.96217668, 0.96217668, 0.96217668, 0.96217668, 0.96217668,
				0.96217668, 0.96217668, 0.961977764, 0.961778794, 0.961778794, 0.961579764, 0.961579764, 0.961579764,
				0.961579764, 0.961579764, 0.961579764, 0.961579764, 0.961579764, 0.961579764, 0.961579764, 0.961379915,
				0.961379915, 0.961179561, 0.961179561, 0.960979108, 0.960979108, 0.96077856, 0.96077856, 0.96077856,
				0.96077856, 0.960577673, 0.960376757, 0.960376757, 0.960376757, 0.960376757, 0.960376757, 0.960175407,
				0.960175407, 0.960175407, 0.960175407, 0.960175407, 0.960175407, 0.960175407, 0.959973554, 0.959771348,
				0.959569041, 0.95936666, 0.95936666, 0.95936666, 0.959163843, 0.958960561, 0.958960561, 0.958757238,
				0.958757238, 0.958757238, 0.958757238, 0.958553777, 0.958350338, 0.958350338, 0.958350338, 0.958350338,
				0.958350338, 0.958350338, 0.958350338, 0.958350338, 0.958350338, 0.958350338, 0.95814574, 0.95814574,
				0.95794059, 0.95794059, 0.957735439, 0.957735439, 0.957735439, 0.957529917, 0.957324365, 0.957118848,
				0.957118848, 0.957118848, 0.956913216, 0.956913216, 0.956913216, 0.956913216, 0.956913216, 0.956913216,
				0.956706761, 0.956500284, 0.956500284, 0.956500284, 0.956500284, 0.956500284, 0.956500284, 0.956293226,
				0.956293226, 0.956293226, 0.956086006, 0.955878548, 0.955878548, 0.955670863, 0.955670863, 0.955670863,
				0.955670863, 0.955670863, 0.955462751, 0.955462751, 0.955254592, 0.955254592, 0.955254592, 0.955254592,
				0.955254592, 0.955045911, 0.955045911, 0.955045911, 0.955045911, 0.954836577, 0.954836577, 0.954836577,
				0.954836577, 0.954836577, 0.954836577, 0.954836577, 0.954626638, 0.95441644, 0.954206227, 0.954206227,
				0.953995819, 0.953995819, 0.953995819, 0.953995819, 0.953995819, 0.953995819, 0.953995819, 0.953784317,
				0.953784317, 0.953572696, 0.953572696, 0.953572696, 0.953360938, 0.953360938, 0.953360938, 0.95314887,
				0.95314887, 0.95314887, 0.952936483, 0.952936483, 0.952723837, 0.952723837, 0.952511053, 0.952511053,
				0.952298089, 0.952298089, 0.952084634, 0.952084634, 0.952084634, 0.951870849, 0.951870849, 0.951870849,
				0.951656776, 0.951656776, 0.951656776, 0.951656776, 0.951656776, 0.951656776, 0.951656776, 0.951441981,
				0.951441981, 0.951441981, 0.951441981, 0.951226288, 0.951226288, 0.951226288, 0.951226288, 0.951226288,
				0.951226288, 0.951226288, 0.951009621, 0.950792957, 0.950576114, 0.950359254, 0.950142322, 0.950142322,
				0.950142322, 0.949925312, 0.949925312, 0.949925312, 0.949925312, 0.949925312, 0.949707415, 0.94948938,
				0.94948938, 0.949271356, 0.949271356, 0.949271356, 0.949271356, 0.949053037, 0.948834718, 0.948834718,
				0.948834718, 0.948834718, 0.948616045, 0.948397409, 0.948397409, 0.948178589, 0.948178589, 0.948178589,
				0.948178589, 0.947959579, 0.947959579, 0.947740406, 0.947521175, 0.947301961, 0.947301961, 0.947082717,
				0.947082717, 0.946863079, 0.946863079, 0.946863079, 0.946863079, 0.946863079, 0.946642963, 0.946642963,
				0.946642963, 0.946642963, 0.946642963, 0.946642963, 0.946642963, 0.946422233, 0.946422233, 0.946422233,
				0.946201141, 0.946201141, 0.946201141, 0.946201141, 0.945979522, 0.945979522, 0.945757694, 0.945757694,
				0.945757694, 0.945757694, 0.945757694, 0.945535184, 0.945535184, 0.945535184, 0.945312586, 0.945312586,
				0.945089327, 0.94486593, 0.94486593, 0.944642371, 0.944418737, 0.944418737, 0.944418737, 0.944418737,
				0.944418737, 0.944418737, 0.944418737, 0.944194267, 0.944194267, 0.943969634, 0.943744828, 0.943744828,
				0.943519825, 0.94329444, 0.94329444, 0.94329444, 0.94329444, 0.94329444, 0.943068292, 0.943068292,
				0.942841957, 0.942841957, 0.942841957, 0.942841957, 0.942615177, 0.942387889, 0.942160388, 0.942160388,
				0.942160388, 0.941932711, 0.941705059, 0.941705059, 0.941705059, 0.941477211, 0.941477211, 0.941477211,
				0.941477211, 0.941248607, 0.941248607, 0.941019614, 0.941019614, 0.940790577, 0.940790577, 0.940790577,
				0.940790577, 0.940560597, 0.940560597, 0.940560597, 0.940330397, 0.940330397, 0.940330397, 0.940330397,
				0.940330397, 0.940330397, 0.940330397, 0.940330397, 0.940330397, 0.940330397, 0.940330397, 0.940098494,
				0.939866316, 0.939866316, 0.939866316, 0.93963297, 0.93963297, 0.93963297, 0.93963297, 0.939399298,
				0.939399298, 0.939165569, 0.938931807, 0.938931807, 0.938697558, 0.938463329, 0.938463329, 0.938228524,
				0.937993214, 0.937993214, 0.937993214, 0.937993214, 0.937993214, 0.937757176, 0.937757176, 0.937521102,
				0.93728504, 0.93728504, 0.93728504, 0.93728504, 0.93728504, 0.93728504, 0.937048371, 0.936811724,
				0.936811724, 0.936811724, 0.936811724, 0.936574582, 0.936574582, 0.936574582, 0.936574582, 0.936574582,
				0.936574582, 0.936574582, 0.936336544, 0.936098525, 0.935860329, 0.935621421, 0.935382522, 0.935143483,
				0.935143483, 0.935143483, 0.935143483, 0.935143483, 0.934904165, 0.934904165, 0.934664771, 0.934664771,
				0.934664771, 0.934664771, 0.934664771, 0.934424598, 0.934184058, 0.934184058, 0.934184058, 0.934184058,
				0.934184058, 0.933943239, 0.933702435, 0.933461504, 0.933220601, 0.933220601, 0.932979085, 0.932737521,
				0.932495844, 0.932495844, 0.932254008, 0.932254008, 0.932011803, 0.932011803, 0.931769433, 0.931526992,
				0.931526992, 0.931526992, 0.931284152, 0.931284152, 0.93104114, 0.930797877, 0.930797877, 0.93055433,
				0.93031076, 0.93031076, 0.930066837, 0.930066837, 0.930066837, 0.930066837, 0.930066837, 0.929821942,
				0.929821942, 0.929576968, 0.929576968, 0.929576968, 0.929576968, 0.929576968, 0.929576968, 0.929576968,
				0.929330349, 0.929330349, 0.929330349, 0.929330349, 0.929330349, 0.929330349, 0.929082907, 0.92883534,
				0.92883534, 0.928587653, 0.928587653, 0.928339838, 0.928339838, 0.928339838, 0.928091251, 0.927842361,
				0.927842361, 0.927842361, 0.927842361, 0.927842361, 0.927842361, 0.927591611, 0.927340526, 0.927089402,
				0.926838164, 0.926838164, 0.926586073, 0.926333311, 0.926333311, 0.926333311, 0.926080172, 0.926080172,
				0.926080172, 0.926080172, 0.925825973, 0.92557159, 0.92557159, 0.92557159, 0.92557159, 0.925316333,
				0.925316333, 0.925060562, 0.924804746, 0.924804746, 0.924804746, 0.924548653, 0.924292574, 0.924292574,
				0.924292574, 0.924036176, 0.924036176, 0.924036176, 0.92377903, 0.92377903, 0.92377903, 0.92377903,
				0.92377903, 0.92352153, 0.92352153, 0.92352153, 0.92352153, 0.92352153, 0.92352153, 0.923263092,
				0.923263092, 0.923004562, 0.923004562, 0.923004562, 0.923004562, 0.923004562, 0.923004562, 0.923004562,
				0.922744784, 0.922484685, 0.922484685, 0.922224233, 0.92196328, 0.92196328, 0.921701842, 0.921439956,
				0.921439956, 0.921177434, 0.921177434, 0.921177434, 0.921177434, 0.921177434, 0.921177434, 0.921177434,
				0.921177434, 0.920910625, 0.920643427, 0.920376008, 0.920376008, 0.920107433, 0.920107433, 0.91983871,
				0.91983871, 0.91983871, 0.91956953, 0.919300087, 0.919029826, 0.919029826, 0.919029826, 0.918758565,
				0.918485908, 0.918213173, 0.918213173, 0.917939832, 0.917939832, 0.917665669, 0.917665669, 0.917391013,
				0.917391013, 0.917115523, 0.916840007, 0.916564237 ];
		var F = new Array(1500);
		var G = new Array(1500);
		var K = new Array(1500);
		var M = new Array(1500);
		var R2 = 0.34362;
		var R3 = 2.63588;
		var R4 = 1.8803;
		var R5 = 1.12673;
		var R6 = -0.90941;
		var R7 = 0.59397;
		var R8 = 0.5232;
		var R9 = 0.68602;
		var Q2 = (isMale) ? 1 : 0;
		var Q3 = Math.log(age);
		var Q4 = Math.log(systolicBp);
		var Q5 = Math.log(cholesterol);
		var Q6 = Math.log(hdl);
		var Q7 = (smoker) ? 1 : 0;
		var Q8 = (treatedBp) ? 1 : 0;
		var Q9 = (diabetic) ? 1 : 0;
		var S2 = Q2 * R2;
		var S3 = Q3 * R3;
		var S4 = Q4 * R4;
		var S5 = Q5 * R5;
		var S6 = Q6 * R6;
		var S7 = Q7 * R7;
		var S8 = Q8 * R8;
		var S9 = Q9 * R9;
		var S11 = S2 + S3 + S4 + S5 + S6 + S7 + S8 + S9;
		var T2 = 0.48123;
		var T3 = 3.39222;
		var T4 = 1.39862;
		var T5 = -0.00439;
		var T6 = 0.16081;
		var T7 = 0.99858;
		var T8 = 0.19035;
		var T9 = 0.49756;
		var U2 = Q2 * T2;
		var U3 = Q3 * T3;
		var U4 = Q4 * T4;
		var U5 = Q5 * T5;
		var U6 = Q6 * T6;
		var U7 = Q7 * T7;
		var U8 = Q8 * T8;
		var U9 = Q9 * T9;
		var U11 = U2 + U3 + U4 + U5 + U6 + U7 + U8 + U9;
		var W2 = 21.29326612;
		var W5 = Math.exp(S11 - W2);
		var X2 = 20.12840698;
		var X5 = Math.exp(U11 - X2);
		// set F
		for (i = 0; i < E.length && i < F.length; i++) {
			F[i] = Math.pow(E[i], W5);
		}
		// set G
		for ( i = 0; i + 1 < E.length; i++) {
			G[i] = Math.log(E[i]) - Math.log(E[i + 1]);
		}
		// set K
		for ( i = 0; i < K.length && i < J.length; i++) {
			K[i] = Math.pow(J[i], X5);
		}
		// set M
		M[0] = W5 * (-Math.log(E[0]));
		for ( i = 0; i + 1 < M.length && i < F.length && i < K.length && i < G.length; i++) {
			M[i + 1] = F[i] * K[i] * W5 * G[i];
		}
		// now we can calculate the risk values
		var fullRisk = 0;
		for ( i = 0; i < M.length && !isNaN(M[i]); i++) {
			fullRisk = fullRisk + M[i];
		}
		return Math.round(100*fullRisk);
	}

	function calculateHardRiskNoBmiInternal( age, isMale,  systolicBp,  cholesterol,  hdl, smoker, treatedBp, diabetic) {
		var i=0;  // loop invariant
		var E = [ 0.99989223, 0.99989223, 0.99989223, 0.9997844, 0.999676537, 0.999676537, 0.999568591,
				0.999568591, 0.999568591, 0.999460474, 0.999460474, 0.999352333, 0.999352333, 0.999352333, 0.999244022,
				0.999135647, 0.999027221, 0.998918678, 0.998918678, 0.998918678, 0.998810045, 0.998810045, 0.998701294,
				0.998592538, 0.998592538, 0.998592538, 0.99848344, 0.998374296, 0.998265086, 0.998265086, 0.998155839,
				0.998155839, 0.99804647, 0.99804647, 0.99804647, 0.99804647, 0.997936874, 0.997827233, 0.997717558,
				0.997717558, 0.997607689, 0.997497246, 0.997386721, 0.997276046, 0.997165328, 0.997054488, 0.996943489,
				0.996832339, 0.996832339, 0.996832339, 0.996720949, 0.996609432, 0.996497798, 0.996497798, 0.996497798,
				0.996386054, 0.996274187, 0.996162208, 0.996050183, 0.995938163, 0.995826068, 0.995713817, 0.995601373,
				0.995488809, 0.995376109, 0.995263343, 0.995150588, 0.995037182, 0.995037182, 0.99492377, 0.994810334,
				0.994696853, 0.994583373, 0.994583373, 0.994469691, 0.994469691, 0.994355653, 0.994355653, 0.994355653,
				0.994355653, 0.994241355, 0.99412703, 0.99401268, 0.993898284, 0.993898284, 0.993898284, 0.993783683,
				0.993668887, 0.99355398, 0.993439001, 0.993324005, 0.993324005, 0.993324005, 0.993324005, 0.993324005,
				0.993208547, 0.993092982, 0.992977392, 0.992861801, 0.992746193, 0.992630573, 0.992630573, 0.992514877,
				0.992514877, 0.992514877, 0.992398562, 0.992398562, 0.992282173, 0.992165739, 0.992049285, 0.992049285,
				0.99193276, 0.991816122, 0.991699452, 0.991582702, 0.991465914, 0.991349122, 0.991232255, 0.991115362,
				0.99099844, 0.990881387, 0.990881387, 0.990764257, 0.990764257, 0.990646852, 0.990529399, 0.99041194,
				0.99041194, 0.990294124, 0.990176296, 0.990176296, 0.990058191, 0.989939936, 0.989939936, 0.989821602,
				0.989703254, 0.989703254, 0.989584663, 0.989466015, 0.989466015, 0.989347321, 0.98922858, 0.98922858,
				0.989109735, 0.988990804, 0.988871843, 0.988752729, 0.988633557, 0.98851439, 0.98851439, 0.988394742,
				0.988274939, 0.988274939, 0.988155063, 0.988035168, 0.988035168, 0.987915174, 0.987795163, 0.987675055,
				0.987675055, 0.987554926, 0.987554926, 0.987554926, 0.987434591, 0.98731421, 0.987193768, 0.987193768,
				0.987193768, 0.987072817, 0.986951684, 0.986951684, 0.986830404, 0.986830404, 0.986709003, 0.986587546,
				0.986466095, 0.986344481, 0.986344481, 0.986222715, 0.986222715, 0.986222715, 0.986100683, 0.985978497,
				0.985978497, 0.985856165, 0.985856165, 0.985733729, 0.985611141, 0.985488483, 0.985488483, 0.985365602,
				0.985242703, 0.985119406, 0.985119406, 0.985119406, 0.984995886, 0.984872351, 0.984872351, 0.984872351,
				0.984748582, 0.984748582, 0.984748582, 0.984624675, 0.984624675, 0.984500637, 0.984376575, 0.984252493,
				0.984128395, 0.984004254, 0.984004254, 0.983879905, 0.983879905, 0.983879905, 0.983755502, 0.983755502,
				0.983755502, 0.983630861, 0.983630861, 0.98350618, 0.983381484, 0.983256779, 0.983132, 0.983007145,
				0.98288229, 0.98288229, 0.982757355, 0.982632406, 0.982507442, 0.982507442, 0.982382346, 0.982382346,
				0.982257185, 0.982131956, 0.982131956, 0.982131956, 0.98200657, 0.98200657, 0.981881085, 0.981755544,
				0.98162994, 0.981504259, 0.981378543, 0.981378543, 0.981252697, 0.981126841, 0.981126841, 0.981000856,
				0.981000856, 0.981000856, 0.980874447, 0.980874447, 0.980747819, 0.980747819, 0.980621066, 0.980621066,
				0.980494204, 0.980494204, 0.980494204, 0.980366965, 0.980366965, 0.980239486, 0.980111906, 0.979984325,
				0.979984325, 0.979984325, 0.979856453, 0.979856453, 0.979728434, 0.979600368, 0.979472232, 0.979472232,
				0.979344037, 0.979215808, 0.979215808, 0.979215808, 0.979215808, 0.97908735, 0.97908735, 0.97908735,
				0.97908735, 0.978958646, 0.978829869, 0.978701086, 0.978572207, 0.978443194, 0.978443194, 0.978314057,
				0.978314057, 0.978184737, 0.978184737, 0.97805528, 0.977925797, 0.977925797, 0.977795841, 0.977795841,
				0.977795841, 0.977665752, 0.977665752, 0.977665752, 0.977535425, 0.977405024, 0.977405024, 0.977405024,
				0.97727435, 0.977143685, 0.977012951, 0.976882155, 0.976751179, 0.976751179, 0.976751179, 0.976620114,
				0.976488931, 0.976488931, 0.976357314, 0.976225666, 0.976225666, 0.976093954, 0.976093954, 0.976093954,
				0.976093954, 0.975961824, 0.975829493, 0.975696823, 0.975564136, 0.975431418, 0.975431418, 0.975431418,
				0.975298559, 0.975165608, 0.975032494, 0.975032494, 0.974899313, 0.974899313, 0.97476595, 0.97476595,
				0.974632414, 0.974498892, 0.974498892, 0.974498892, 0.974365187, 0.974365187, 0.974231447, 0.974097694,
				0.97396386, 0.97396386, 0.973829968, 0.973695705, 0.973695705, 0.973561302, 0.973561302, 0.973426812,
				0.97329233, 0.973157792, 0.973023165, 0.972888502, 0.972753686, 0.972753686, 0.972618599, 0.972483401,
				0.972348192, 0.972212959, 0.972212959, 0.972077497, 0.971942025, 0.971806564, 0.971806564, 0.971671016,
				0.971535469, 0.971399832, 0.971263727, 0.971127505, 0.971127505, 0.971127505, 0.971127505, 0.970990911,
				0.970854255, 0.970854255, 0.970716143, 0.970716143, 0.970577898, 0.970439634, 0.970439634, 0.970301283,
				0.970301283, 0.970162586, 0.970023864, 0.970023864, 0.970023864, 0.969885043, 0.969746157, 0.969746157,
				0.969607121, 0.969607121, 0.969467906, 0.969328605, 0.969328605, 0.969189095, 0.969049555, 0.96890993,
				0.968770148, 0.968630236, 0.968630236, 0.968490195, 0.968350094, 0.968350094, 0.968350094, 0.968350094,
				0.968209822, 0.968069503, 0.968069503, 0.967929069, 0.967788583, 0.967648104, 0.967507426, 0.967507426,
				0.967507426, 0.967507426, 0.967507426, 0.967366445, 0.967366445, 0.967366445, 0.967366445, 0.967366445,
				0.967225072, 0.967225072, 0.967225072, 0.967083346, 0.967083346, 0.966941484, 0.966941484, 0.966941484,
				0.966799431, 0.966657323, 0.966515221, 0.966515221, 0.966515221, 0.966372675, 0.966372675, 0.966230095,
				0.966087497, 0.965944844, 0.965802025, 0.965802025, 0.965659107, 0.965659107, 0.965515789, 0.965372381,
				0.965372381, 0.9652289, 0.965085397, 0.964941748, 0.964941748, 0.964941748, 0.964941748, 0.964797845,
				0.964797845, 0.964797845, 0.964797845, 0.964797845, 0.964652345, 0.964652345, 0.964652345, 0.964652345,
				0.964652345, 0.964506431, 0.964360374, 0.964214292, 0.964214292, 0.964067992, 0.963921559, 0.963921559,
				0.963774931, 0.963628306, 0.963481699, 0.963481699, 0.96333502, 0.963188259, 0.963041277, 0.962894248,
				0.962746922, 0.962746922, 0.962599438, 0.96245194, 0.962304394, 0.962156773, 0.962156773, 0.962008591,
				0.961860378, 0.961860378, 0.961711958, 0.961711958, 0.96156345, 0.96141486, 0.961266259, 0.961117297,
				0.960968325, 0.960968325, 0.960968325, 0.960819143, 0.960819143, 0.960669959, 0.960520666, 0.96037136,
				0.96037136, 0.96037136, 0.96037136, 0.96037136, 0.96037136, 0.96037136, 0.960220987, 0.960070585,
				0.959919945, 0.959919945, 0.959919945, 0.959919945, 0.959919945, 0.959768593, 0.959617193, 0.959617193,
				0.959617193, 0.959617193, 0.959617193, 0.959617193, 0.959617193, 0.959617193, 0.959464998, 0.959464998,
				0.959311842, 0.959311842, 0.959158581, 0.959005319, 0.958851942, 0.958698579, 0.958698579, 0.958698579,
				0.958698579, 0.958545052, 0.958391494, 0.958391494, 0.9582379, 0.9582379, 0.9582379, 0.9582379,
				0.9582379, 0.958083902, 0.958083902, 0.958083902, 0.957929622, 0.957774955, 0.957774955, 0.957774955,
				0.957774955, 0.957774955, 0.957619965, 0.957619965, 0.957619965, 0.957464847, 0.957464847, 0.957464847,
				0.957309328, 0.957309328, 0.957153637, 0.957153637, 0.957153637, 0.956997804, 0.956997804, 0.956841937,
				0.956686065, 0.956686065, 0.956686065, 0.956530084, 0.956373803, 0.956373803, 0.95621749, 0.956061106,
				0.955904677, 0.955748076, 0.955591451, 0.955434795, 0.955277962, 0.955277962, 0.955121, 0.955121,
				0.955121, 0.955121, 0.955121, 0.955121, 0.954962774, 0.954804098, 0.954645324, 0.954645324,
				0.954645324, 0.954645324, 0.954486493, 0.95432756, 0.95432756, 0.95432756, 0.95432756, 0.95416855,
				0.95416855, 0.954009522, 0.954009522, 0.953850254, 0.953850254, 0.953690764, 0.953531238, 0.953371712,
				0.953371712, 0.953212034, 0.953212034, 0.953212034, 0.953052195, 0.952892355, 0.952732504, 0.952732504,
				0.952572378, 0.952412089, 0.952412089, 0.952412089, 0.952412089, 0.952251457, 0.952090828, 0.952090828,
				0.95192976, 0.95192976, 0.951768682, 0.951768682, 0.951607477, 0.951446252, 0.951284944, 0.951123624,
				0.951123624, 0.950962256, 0.950800848, 0.950639444, 0.950639444, 0.950639444, 0.950477625, 0.950477625,
				0.950477625, 0.950315425, 0.950153204, 0.949990404, 0.949827405, 0.949664392, 0.949664392, 0.949664392,
				0.949664392, 0.94950083, 0.94950083, 0.94950083, 0.949337114, 0.949173378, 0.949009514, 0.949009514,
				0.94884555, 0.94884555, 0.94884555, 0.948681413, 0.948681413, 0.948681413, 0.948681413, 0.94851707,
				0.94851707, 0.94835196, 0.948186731, 0.948186731, 0.948186731, 0.948021228, 0.948021228, 0.948021228,
				0.947855307, 0.947689386, 0.947689386, 0.947523355, 0.947357331, 0.947357331, 0.947357331, 0.947190969,
				0.947024487, 0.946857953, 0.946857953, 0.946857953, 0.946691255, 0.946524514, 0.946357651, 0.946190793,
				0.946190793, 0.946190793, 0.946023761, 0.94585657, 0.94585657, 0.945689233, 0.945521884, 0.945354446,
				0.945186936, 0.945186936, 0.945186936, 0.945019075, 0.945019075, 0.944850821, 0.944850821, 0.944682248,
				0.944682248, 0.94451354, 0.944344834, 0.944344834, 0.944344834, 0.944344834, 0.944344834, 0.944344834,
				0.944175357, 0.944005645, 0.944005645, 0.943835795, 0.943835795, 0.943665924, 0.943495963, 0.943495963,
				0.943325882, 0.943325882, 0.943155626, 0.942985392, 0.942985392, 0.942814967, 0.942814967, 0.942814967,
				0.942814967, 0.942644357, 0.942644357, 0.942644357, 0.942473429, 0.94230248, 0.942131355, 0.941960133,
				0.941960133, 0.941788768, 0.941788768, 0.941617217, 0.941445654, 0.941274104, 0.941102559, 0.941102559,
				0.940930621, 0.940930621, 0.94075829, 0.940585684, 0.940585684, 0.940585684, 0.940585684, 0.940585684,
				0.940585684, 0.940412685, 0.940239648, 0.940066612, 0.940066612, 0.939893345, 0.939893345, 0.939893345,
				0.9397196, 0.939545671, 0.939545671, 0.939545671, 0.939545671, 0.939545671, 0.939545671, 0.939545671,
				0.939545671, 0.939370907, 0.939370907, 0.939370907, 0.939196015, 0.939196015, 0.9390211, 0.9390211,
				0.938845833, 0.938845833, 0.938845833, 0.938845833, 0.938670447, 0.938670447, 0.938670447, 0.938494837,
				0.938319253, 0.938319253, 0.938143619, 0.93796798, 0.93796798, 0.93796798, 0.937792057, 0.937615924,
				0.937615924, 0.937439603, 0.937263072, 0.937086451, 0.937086451, 0.937086451, 0.936909665, 0.936909665,
				0.936732791, 0.936555948, 0.936555948, 0.936555948, 0.936555948, 0.936555948, 0.936377819, 0.936377819,
				0.936377819, 0.936199497, 0.936199497, 0.936020453, 0.936020453, 0.936020453, 0.936020453, 0.936020453,
				0.935840668, 0.935840668, 0.935840668, 0.935660462, 0.935480231, 0.935299883, 0.935299883, 0.935299883,
				0.935299883, 0.935299883, 0.935119065, 0.935119065, 0.935119065, 0.935119065, 0.934937369, 0.934937369,
				0.93475556, 0.93475556, 0.934573728, 0.934573728, 0.934391818, 0.934391818, 0.934209879, 0.934209879,
				0.934209879, 0.934209879, 0.934027171, 0.934027171, 0.933844279, 0.933661317, 0.933661317, 0.933478056,
				0.933478056, 0.933294766, 0.933111166, 0.933111166, 0.932926983, 0.932742769, 0.932558451, 0.932374008,
				0.932374008, 0.932374008, 0.932374008, 0.932188981, 0.932003552, 0.932003552, 0.931818076, 0.931632571,
				0.931447047, 0.93126135, 0.93126135, 0.93126135, 0.93126135, 0.93126135, 0.931075055, 0.930888744,
				0.930888744, 0.930888744, 0.930701713, 0.930701713, 0.930701713, 0.930514165, 0.930326462, 0.930326462,
				0.930326462, 0.930326462, 0.930138065, 0.929949486, 0.929949486, 0.929949486, 0.929949486, 0.929760152,
				0.929570745, 0.929570745, 0.929570745, 0.929380944, 0.929380944, 0.929380944, 0.929380944, 0.929380944,
				0.929380944, 0.92918916, 0.928997392, 0.928997392, 0.928997392, 0.928805459, 0.928613126, 0.928613126,
				0.928613126, 0.928613126, 0.928420021, 0.928226946, 0.928226946, 0.928226946, 0.928226946, 0.928226946,
				0.928226946, 0.928226946, 0.928226946, 0.928226946, 0.928226946, 0.928226946, 0.928226946, 0.928031824,
				0.928031824, 0.928031824, 0.928031824, 0.927836316, 0.927836316, 0.927640467, 0.927444576, 0.927444576,
				0.927444576, 0.927444576, 0.92724812, 0.92724812, 0.92724812, 0.92724812, 0.927051222, 0.926853248,
				0.926655181, 0.926655181, 0.926456979, 0.926258616, 0.926258616, 0.926060232, 0.926060232, 0.925861012,
				0.925661703, 0.92546209, 0.925262475, 0.925062826, 0.925062826, 0.924862888, 0.924662622, 0.924462351,
				0.924261758, 0.924261758, 0.924261758, 0.924060941, 0.924060941, 0.924060941, 0.924060941, 0.924060941,
				0.923859719, 0.923658372, 0.923456846, 0.923456846, 0.923456846, 0.923456846, 0.92325444, 0.92325444,
				0.923051693, 0.923051693, 0.923051693, 0.922848018, 0.922644281, 0.922644281, 0.922440225, 0.922440225,
				0.922440225, 0.922235278, 0.92203034, 0.92203034, 0.92203034, 0.921824808, 0.921824808, 0.921824808,
				0.921619012, 0.921413184, 0.921207316, 0.921207316, 0.921207316, 0.921207316, 0.92100099, 0.92100099,
				0.92100099, 0.920794493, 0.920587902, 0.920381004, 0.920174134, 0.920174134, 0.919966596, 0.919758588,
				0.919550543, 0.919550543, 0.919342352, 0.919134183, 0.919134183, 0.918925895, 0.918925895, 0.918717354,
				0.918508672, 0.918299597, 0.918090276, 0.918090276, 0.918090276, 0.917880584, 0.917880584, 0.917670665,
				0.917670665, 0.917670665, 0.917670665, 0.917460044, 0.917460044, 0.917460044, 0.917460044, 0.917248916,
				0.917248916, 0.917248916, 0.917037134, 0.916824573, 0.916611331, 0.916611331, 0.916611331, 0.916611331,
				0.916396435, 0.916396435, 0.916396435, 0.916180894, 0.91596538, 0.91596538, 0.91596538, 0.91596538,
				0.915748037, 0.915748037, 0.915748037, 0.915748037, 0.915529365, 0.915529365, 0.915309984, 0.915309984,
				0.915089997, 0.915089997, 0.914869669, 0.914869669, 0.914869669, 0.914869669 ];
		var J = [ 1, 0.999877285, 0.999754544, 0.999754544, 0.999754544, 0.999631656, 0.999631656, 0.999508664,
				0.999385572, 0.999385572, 0.999262395, 0.999262395, 0.999139173, 0.999015856, 0.999015856, 0.999015856,
				0.999015856, 0.999015856, 0.998892061, 0.998768276, 0.998768276, 0.998644338, 0.998644338, 0.998644338,
				0.99852026, 0.998396037, 0.998396037, 0.998396037, 0.998396037, 0.99827162, 0.99827162, 0.998147122,
				0.998147122, 0.998022525, 0.997897659, 0.997772801, 0.997772801, 0.997772801, 0.997772801, 0.997647672,
				0.997647672, 0.997647672, 0.997647672, 0.997647672, 0.997647672, 0.997647672, 0.997647672, 0.997647672,
				0.997521468, 0.997395249, 0.997395249, 0.997395249, 0.997395249, 0.997268511, 0.997141769, 0.997141769,
				0.997141769, 0.997141769, 0.997141769, 0.997141769, 0.997141769, 0.997141769, 0.997141769, 0.997141769,
				0.997141769, 0.997141769, 0.997141769, 0.997141769, 0.997013857, 0.997013857, 0.997013857, 0.997013857,
				0.997013857, 0.996885746, 0.996885746, 0.99675757, 0.99675757, 0.996629046, 0.996500415, 0.996371794,
				0.996371794, 0.996371794, 0.996371794, 0.996371794, 0.99624301, 0.996114192, 0.996114192, 0.996114192,
				0.996114192, 0.996114192, 0.996114192, 0.99598468, 0.995855165, 0.995725597, 0.995595925, 0.995595925,
				0.995595925, 0.995595925, 0.995595925, 0.995595925, 0.995595925, 0.995465907, 0.995465907, 0.995335604,
				0.995205271, 0.995205271, 0.995074821, 0.995074821, 0.995074821, 0.995074821, 0.994944218, 0.994944218,
				0.994944218, 0.994944218, 0.994944218, 0.994944218, 0.994944218, 0.994944218, 0.994944218, 0.994944218,
				0.994944218, 0.994812814, 0.994812814, 0.994681269, 0.994681269, 0.994681269, 0.994681269, 0.994549161,
				0.994549161, 0.994549161, 0.99441697, 0.99441697, 0.99441697, 0.994284413, 0.994284413, 0.994284413,
				0.994151553, 0.994151553, 0.994151553, 0.994018498, 0.994018498, 0.994018498, 0.993885265, 0.993885265,
				0.993885265, 0.993885265, 0.993885265, 0.993885265, 0.993885265, 0.993751532, 0.993751532, 0.993751532,
				0.993617235, 0.993617235, 0.993617235, 0.993482859, 0.993482859, 0.993482859, 0.993482859, 0.993348291,
				0.993348291, 0.993213656, 0.993078862, 0.993078862, 0.993078862, 0.993078862, 0.99294386, 0.992808446,
				0.992808446, 0.992808446, 0.992672703, 0.992672703, 0.992536714, 0.992536714, 0.992536714, 0.992536714,
				0.992536714, 0.992400502, 0.992400502, 0.99226416, 0.992127771, 0.992127771, 0.992127771, 0.991991101,
				0.991991101, 0.991854247, 0.991854247, 0.991854247, 0.991854247, 0.991716994, 0.991716994, 0.991716994,
				0.991716994, 0.991579218, 0.991441147, 0.991441147, 0.991441147, 0.991302878, 0.99116455, 0.99116455,
				0.991026071, 0.990887606, 0.990887606, 0.990748967, 0.990748967, 0.990748967, 0.990748967, 0.990748967,
				0.990748967, 0.990610021, 0.990610021, 0.990470985, 0.990331936, 0.990331936, 0.990192776, 0.990053625,
				0.990053625, 0.9899143, 0.9899143, 0.9899143, 0.9899143, 0.9899143, 0.9899143, 0.9899143, 0.989774681,
				0.989774681, 0.989774681, 0.989774681, 0.989634881, 0.989634881, 0.98949498, 0.98949498, 0.98949498,
				0.98935486, 0.989214646, 0.989214646, 0.989074368, 0.989074368, 0.989074368, 0.989074368, 0.989074368,
				0.989074368, 0.988933633, 0.988933633, 0.988933633, 0.98879268, 0.98879268, 0.988651572, 0.988510447,
				0.988510447, 0.98836905, 0.98836905, 0.988227536, 0.988227536, 0.98808586, 0.98808586, 0.987943669,
				0.987801425, 0.987801425, 0.987658938, 0.987658938, 0.987658938, 0.987658938, 0.98751613, 0.987373315,
				0.987373315, 0.987230311, 0.987230311, 0.987230311, 0.987230311, 0.987086981, 0.987086981, 0.987086981,
				0.986943431, 0.986799798, 0.986656134, 0.986656134, 0.986512299, 0.986368466, 0.986224546, 0.986224546,
				0.986224546, 0.986224546, 0.986224546, 0.986224546, 0.986080241, 0.986080241, 0.985935786, 0.985935786,
				0.985791137, 0.985791137, 0.985791137, 0.985646236, 0.985646236, 0.985501229, 0.985356192, 0.985356192,
				0.985211015, 0.985065817, 0.985065817, 0.985065817, 0.984920047, 0.984774054, 0.984774054, 0.984774054,
				0.984774054, 0.984774054, 0.984774054, 0.984627712, 0.984481332, 0.984481332, 0.984481332, 0.984334645,
				0.984334645, 0.984334645, 0.984187717, 0.984187717, 0.984040565, 0.983893359, 0.983746108, 0.983746108,
				0.983746108, 0.983746108, 0.983746108, 0.983746108, 0.983598124, 0.983450134, 0.983450134, 0.983450134,
				0.983450134, 0.983301738, 0.983301738, 0.983153231, 0.983153231, 0.983004596, 0.983004596, 0.983004596,
				0.982855852, 0.982707103, 0.982707103, 0.982558273, 0.982558273, 0.982558273, 0.982558273, 0.982409289,
				0.982409289, 0.982409289, 0.982260033, 0.982260033, 0.98211057, 0.98211057, 0.98211057, 0.98211057,
				0.98211057, 0.98211057, 0.98211057, 0.981960382, 0.981960382, 0.981960382, 0.981960382, 0.981960382,
				0.9818098, 0.9818098, 0.9818098, 0.9818098, 0.981658873, 0.981658873, 0.981658873, 0.981658873,
				0.981658873, 0.981658873, 0.98150718, 0.981355389, 0.981203556, 0.981203556, 0.981203556, 0.981051451,
				0.981051451, 0.980899036, 0.980899036, 0.980899036, 0.980746444, 0.980746444, 0.980593667, 0.980593667,
				0.980593667, 0.980440701, 0.980287738, 0.980287738, 0.980287738, 0.980134532, 0.980134532, 0.979981207,
				0.979981207, 0.979981207, 0.979827611, 0.979827611, 0.979827611, 0.979827611, 0.979827611, 0.979827611,
				0.979673456, 0.979673456, 0.979673456, 0.979518884, 0.979364324, 0.979209767, 0.979209767, 0.979209767,
				0.97905505, 0.97905505, 0.97905505, 0.97905505, 0.97905505, 0.978900127, 0.978745173, 0.978590153,
				0.97843509, 0.97843509, 0.978279837, 0.978124543, 0.977969254, 0.977813891, 0.977813891, 0.977658162,
				0.977502357, 0.977502357, 0.977346366, 0.977346366, 0.977190322, 0.97703417, 0.97703417, 0.97703417,
				0.97703417, 0.976877834, 0.976721499, 0.976721499, 0.976564931, 0.976564931, 0.976564931, 0.976564931,
				0.976564931, 0.976407876, 0.976407876, 0.976250519, 0.976250519, 0.976250519, 0.976092957, 0.976092957,
				0.976092957, 0.976092957, 0.975935151, 0.975777142, 0.975619126, 0.975619126, 0.975460489, 0.975301645,
				0.975142652, 0.974983388, 0.974983388, 0.974823932, 0.974664418, 0.974504677, 0.974344931, 0.974344931,
				0.974344931, 0.974344931, 0.974184654, 0.974184654, 0.974184654, 0.97402423, 0.97402423, 0.97402423,
				0.97402423, 0.973863623, 0.973863623, 0.973863623, 0.973863623, 0.973863623, 0.973863623, 0.973702293,
				0.973702293, 0.973702293, 0.973702293, 0.973702293, 0.973540153, 0.973540153, 0.973540153, 0.973377514,
				0.973377514, 0.973214761, 0.973214761, 0.973214761, 0.973214761, 0.973214761, 0.973214761, 0.973051484,
				0.972888192, 0.972888192, 0.97272488, 0.97272488, 0.97272488, 0.97272488, 0.972561372, 0.972397741,
				0.972233909, 0.972070078, 0.971906094, 0.971741968, 0.971741968, 0.971741968, 0.971741968, 0.97157724,
				0.97141228, 0.971247066, 0.971081784, 0.971081784, 0.971081784, 0.9709163, 0.970750726, 0.970585117,
				0.970419496, 0.97025382, 0.970087889, 0.969921971, 0.969921971, 0.969755552, 0.969755552, 0.969588543,
				0.969588543, 0.969588543, 0.969588543, 0.969588543, 0.969421233, 0.969253941, 0.96908662, 0.96908662,
				0.96908662, 0.968919122, 0.968919122, 0.968751569, 0.968584016, 0.968416359, 0.968248694, 0.968248694,
				0.968080887, 0.967912949, 0.967912949, 0.967912949, 0.967744501, 0.967575948, 0.967407365, 0.967238764,
				0.967238764, 0.967070012, 0.966901269, 0.966901269, 0.966732415, 0.966563563, 0.966563563, 0.966394448,
				0.966394448, 0.966225159, 0.966055746, 0.966055746, 0.965886288, 0.965886288, 0.965886288, 0.965716729,
				0.965547174, 0.965547174, 0.965547174, 0.965377159, 0.965377159, 0.965377159, 0.965377159, 0.965377159,
				0.965377159, 0.965377159, 0.965377159, 0.965206376, 0.965206376, 0.965035481, 0.964864256, 0.964692999,
				0.964521516, 0.964350053, 0.964350053, 0.964350053, 0.964350053, 0.964177297, 0.964004525, 0.963831778,
				0.963831778, 0.963831778, 0.963658887, 0.963485998, 0.963313092, 0.963313092, 0.963140174, 0.963140174,
				0.962967139, 0.962967139, 0.962793848, 0.962793848, 0.962793848, 0.962793848, 0.96262023, 0.96262023,
				0.962446273, 0.962272325, 0.962272325, 0.962272325, 0.962272325, 0.962098219, 0.962098219, 0.962098219,
				0.961923424, 0.96174856, 0.961573714, 0.961573714, 0.961573714, 0.961398572, 0.961398572, 0.961223286,
				0.961223286, 0.961047939, 0.961047939, 0.961047939, 0.961047939, 0.961047939, 0.960872253, 0.960872253,
				0.960872253, 0.960872253, 0.960696398, 0.960520282, 0.960520282, 0.960344039, 0.960167734, 0.960167734,
				0.960167734, 0.960167734, 0.960167734, 0.960167734, 0.959990343, 0.959812589, 0.959634839, 0.959634839,
				0.959457073, 0.959279325, 0.959279325, 0.959279325, 0.959279325, 0.959101175, 0.959101175, 0.958922981,
				0.958744797, 0.958744797, 0.958566468, 0.958388117, 0.958209794, 0.958209794, 0.958030939, 0.958030939,
				0.958030939, 0.95785173, 0.957672466, 0.957672466, 0.957492956, 0.957313431, 0.957313431, 0.957313431,
				0.95713379, 0.95713379, 0.95713379, 0.956954017, 0.956774052, 0.956774052, 0.956774052, 0.956774052,
				0.956593787, 0.956413464, 0.956413464, 0.956413464, 0.956413464, 0.956413464, 0.956232749, 0.956052006,
				0.956052006, 0.956052006, 0.95587103, 0.95587103, 0.95587103, 0.95587103, 0.95587103, 0.955689655,
				0.955508217, 0.955508217, 0.955326496, 0.955326496, 0.955144486, 0.955144486, 0.954962297, 0.954962297,
				0.954962297, 0.954779788, 0.954597076, 0.954414194, 0.954231301, 0.954048382, 0.954048382, 0.954048382,
				0.953864911, 0.953864911, 0.953681346, 0.953681346, 0.953681346, 0.953497539, 0.953497539, 0.953313578,
				0.953313578, 0.953313578, 0.953129505, 0.953129505, 0.952945232, 0.952760904, 0.952576294, 0.952576294,
				0.952391548, 0.952206614, 0.952206614, 0.952206614, 0.952206614, 0.952206614, 0.952021082, 0.952021082,
				0.951835412, 0.951835412, 0.951835412, 0.951835412, 0.951835412, 0.951649397, 0.951649397, 0.951462826,
				0.951462826, 0.951462826, 0.951275939, 0.951089054, 0.950902017, 0.950714966, 0.95052786, 0.95052786,
				0.95052786, 0.95052786, 0.950340558, 0.950340558, 0.950153047, 0.949965546, 0.949965546, 0.949965546,
				0.949777415, 0.949589181, 0.949400978, 0.949212692, 0.949024356, 0.948835936, 0.948647515, 0.948647515,
				0.948459026, 0.948270565, 0.948270565, 0.948081959, 0.948081959, 0.947893237, 0.947893237, 0.947704387,
				0.947515495, 0.947326615, 0.947326615, 0.947137713, 0.946948593, 0.946948593, 0.946948593, 0.946759248,
				0.946759248, 0.946759248, 0.946569773, 0.946380199, 0.946380199, 0.946380199, 0.946190252, 0.946190252,
				0.946190252, 0.946190252, 0.945999896, 0.945809399, 0.945809399, 0.945618786, 0.945618786, 0.945618786,
				0.945427935, 0.945237011, 0.945045991, 0.944854867, 0.944854867, 0.944663384, 0.944471836, 0.944471836,
				0.944280201, 0.944280201, 0.944088061, 0.943895806, 0.943703509, 0.943511074, 0.943511074, 0.943318489,
				0.943125611, 0.943125611, 0.943125611, 0.943125611, 0.942932211, 0.942738818, 0.942545337, 0.942351765,
				0.942351765, 0.942158006, 0.941963858, 0.941769602, 0.941769602, 0.941575129, 0.941575129, 0.94138054,
				0.94138054, 0.941185958, 0.941185958, 0.940991283, 0.940991283, 0.940796305, 0.94060109, 0.940405643,
				0.940405643, 0.94021016, 0.94021016, 0.94021016, 0.940014094, 0.940014094, 0.939817859, 0.939817859,
				0.939817859, 0.9396209, 0.9396209, 0.9396209, 0.9396209, 0.9396209, 0.939423536, 0.939225901,
				0.939028065, 0.939028065, 0.939028065, 0.938829382, 0.938829382, 0.938829382, 0.938829382, 0.938829382,
				0.938630398, 0.938431416, 0.938232203, 0.938032962, 0.938032962, 0.938032962, 0.937832993, 0.937633039,
				0.937633039, 0.937432695, 0.937231967, 0.937231967, 0.937231967, 0.937030775, 0.936829613, 0.936628459,
				0.936628459, 0.936628459, 0.936427016, 0.936225589, 0.936024068, 0.936024068, 0.936024068, 0.935821855,
				0.935619655, 0.935619655, 0.935416967, 0.935214117, 0.935010744, 0.934807377, 0.934603907, 0.934603907,
				0.934603907, 0.934400281, 0.934196621, 0.934196621, 0.934196621, 0.933992242, 0.933787762, 0.933582999,
				0.933582999, 0.933582999, 0.933378123, 0.933173258, 0.932968293, 0.932763349, 0.932558038, 0.932352688,
				0.932147036, 0.931941303, 0.931735599, 0.931529917, 0.931324037, 0.931324037, 0.931118114, 0.930912138,
				0.93070607, 0.93070607, 0.930499878, 0.930499878, 0.930499878, 0.930293461, 0.930086896, 0.929880137,
				0.929880137, 0.929673167, 0.929466177, 0.929259036, 0.929259036, 0.929259036, 0.929259036, 0.929051026,
				0.929051026, 0.929051026, 0.928842877, 0.928842877, 0.928634347, 0.928634347, 0.928634347, 0.928634347,
				0.928634347, 0.928634347, 0.928424622, 0.928424622, 0.928424622, 0.928424622, 0.928424622, 0.928214193,
				0.928003671, 0.928003671, 0.927793068, 0.92758246, 0.927371675, 0.927160675, 0.927160675, 0.927160675,
				0.927160675, 0.926948875, 0.926736824, 0.926524741, 0.926524741, 0.92631232, 0.92631232, 0.926099272,
				0.925885736, 0.925885736, 0.925885736, 0.92567187, 0.92567187, 0.925457369, 0.925242741, 0.925242741,
				0.925242741, 0.925027475, 0.924812136, 0.924812136, 0.924596415, 0.924380661, 0.924380661, 0.924380661,
				0.924380661, 0.924164658, 0.923948666, 0.923732599, 0.923732599, 0.923516365, 0.923299989, 0.923299989,
				0.923299989, 0.923299989, 0.923299989, 0.923083088, 0.923083088, 0.923083088, 0.923083088, 0.922865545,
				0.922865545, 0.922865545, 0.922647837, 0.922647837, 0.92242982, 0.92242982, 0.92242982, 0.92242982,
				0.92242982, 0.922210775, 0.9219915, 0.9219915, 0.921771962, 0.921771962, 0.921551966, 0.921331785,
				0.921111452, 0.921111452, 0.920890917, 0.920670431, 0.920449623, 0.920449623, 0.920228342, 0.920006364,
				0.920006364, 0.920006364, 0.920006364, 0.91978216, 0.919557671, 0.919333012, 0.919333012, 0.919107533,
				0.918881934, 0.918881934, 0.918881934, 0.918655995, 0.918429711, 0.918202833, 0.918202833, 0.917975265,
				0.917746666, 0.917518009, 0.917518009, 0.917288907, 0.917288907, 0.917059209, 0.917059209, 0.916829168,
				0.916829168, 0.916598516, 0.916367679, 0.916136657 ];
		var F = new Array(1500);
		var G = new Array(1500);
		var K = new Array(1500);
		var M = new Array(1500);
		var Z = new Array(1500);
		var AA = new Array(1500);
		var AB = new Array(1500);
		var AD = new Array(1500);
		var AE = new Array(1500);
		var AF = new Array(1500);
		var Q2 = (isMale) ? 1 : 0;
		var Q3 = Math.log(age);
		var Q4 = Math.log(systolicBp);
		var Q5 = Math.log(cholesterol);
		var Q6 = Math.log(hdl);
		var Q7 = (smoker) ? 1 : 0;
		var Q8 = (treatedBp) ? 1 : 0;
		var Q9 = (diabetic) ? 1 : 0;
		var R2 = 0.55021;
		var R3 = 2.83511;
		var R4 = 1.99822;
		var R5 = 1.4775;
		var R6 = -0.86736;
		var R7 = 0.70063;
		var R8 = 0.39241;
		var R9 = 0.9137;
		var S2 = Q2 * R2;
		var S3 = Q3 * R3;
		var S4 = Q4 * R4;
		var S5 = Q5 * R5;
		var S6 = Q6 * R6;
		var S7 = Q7 * R7;
		var S8 = Q8 * R8;
		var S9 = Q9 * R9;
		var S11 = S2 + S3 + S4 + S5 + S6 + S7 + S8 + S9;
		var T2 = 0.47666;
		var T3 = 3.53291;
		var T4 = 1.43216;
		var T5 = 0.00704;
		var T6 = 0.09148;
		var T7 = 0.97352;
		var T8 = 0.11888;
		var T9 = 0.45355;
		var U2 = Q2 * T2;
		var U3 = Q3 * T3;
		var U4 = Q4 * T4;
		var U5 = Q5 * T5;
		var U6 = Q6 * T6;
		var U7 = Q7 * T7;
		var U8 = Q8 * T8;
		var U9 = Q9 * T9;
		var U11 = U2 + U3 + U4 + U5 + U6 + U7 + U8 + U9;
		var W2 = 24.72839981;
		var W5 = Math.exp(S11 - W2);
		var X2 = 20.56609979;
		var X5 = Math.exp(U11 - X2);
		// set F
		for ( i = 0; i < E.length && i < F.length; i++) {
			F[i] = Math.pow(E[i], W5);
		}
		// set G
		for ( i = 0; i + 1 < E.length; i++) {
			G[i] = Math.log(E[i]) - Math.log(E[i + 1]);
		}
		// set K
		for ( i = 0; i < K.length && i < J.length; i++) {
			K[i] = Math.pow(J[i], X5);
		}
		// set M
		M[0] = W5 * (-Math.log(E[0]));
		for ( i = 0; i + 1 < M.length && i < F.length && i < K.length && i < G.length; i++) {
			M[i + 1] = F[i] * K[i] * W5 * G[i];
		}
		// now we can calculate the risk values
		var hardRisk = 0;
		for ( i = 0; i < M.length && !isNaN(M[i]); i++) {
			hardRisk = hardRisk + M[i];
		}
		return Math.round(100*hardRisk);
	}

	
	function calculateFullRiskBmiInternal( age, isMale, systolicBp, smoker, treatedBp, diabetic, BMI) {
		var i=0;  // loop invariant
		var E = [ 0.999869109, 0.999869109, 0.999869109, 0.999738124, 0.999607108, 0.999607108, 0.999475983,
				0.999344829, 0.999344829, 0.999344829, 0.999213502, 0.999213502, 0.999082126, 0.999082126, 0.999082126,
				0.998950584, 0.998818988, 0.998687332, 0.998555594, 0.998555594, 0.998555594, 0.998423702, 0.998291773,
				0.998159831, 0.998027809, 0.99789578, 0.997763709, 0.997763709, 0.997763709, 0.997631418, 0.997499095,
				0.997366696, 0.997234284, 0.997234284, 0.997101829, 0.997101829, 0.99696931, 0.996836724, 0.996836724,
				0.996836724, 0.996836724, 0.996703641, 0.996570531, 0.996437396, 0.996304176, 0.99617089, 0.99617089,
				0.996037414, 0.995903657, 0.995769871, 0.995636, 0.995502094, 0.995368061, 0.995233926, 0.995099585,
				0.99496513, 0.994830595, 0.994830595, 0.994830595, 0.994695815, 0.994560895, 0.9944257, 0.99429035,
				0.99429035, 0.99429035, 0.994154803, 0.994019251, 0.993883424, 0.993747573, 0.993611657, 0.993475683,
				0.993339265, 0.993202845, 0.993066393, 0.992929943, 0.992793404, 0.992656706, 0.992519986, 0.992383249,
				0.992246486, 0.992109704, 0.991972926, 0.991836109, 0.991699275, 0.991562382, 0.991425397, 0.991288394,
				0.991151356, 0.991014214, 0.99087698, 0.990739734, 0.990602449, 0.990465052, 0.99032756, 0.990189911,
				0.990052193, 0.989914191, 0.989776142, 0.989638049, 0.98949997, 0.989361758, 0.989223437, 0.989085037,
				0.988946585, 0.988808128, 0.988669651, 0.988531071, 0.98839239, 0.988253707, 0.988253707, 0.988115013,
				0.987976288, 0.987837559, 0.987698718, 0.987559822, 0.987420868, 0.987281891, 0.987142783, 0.987003661,
				0.986864544, 0.986725399, 0.986586234, 0.986447018, 0.986307787, 0.986168149, 0.986028505, 0.985888804,
				0.985888804, 0.985749046, 0.985609269, 0.985609269, 0.985469167, 0.985469167, 0.985469167, 0.98532887,
				0.985188428, 0.985047857, 0.984907162, 0.984766125, 0.984766125, 0.984624977, 0.984483809, 0.984342573,
				0.984201349, 0.98406011, 0.983918852, 0.98377761, 0.98377761, 0.983636275, 0.983494887, 0.983353351,
				0.983353351, 0.983211652, 0.983069944, 0.98292818, 0.982786237, 0.982644182, 0.98250208, 0.982359867,
				0.982359867, 0.982359867, 0.982359867, 0.982359867, 0.982217219, 0.982074529, 0.981931786, 0.981788781,
				0.981645764, 0.981502739, 0.981359518, 0.981216272, 0.981072928, 0.980929579, 0.980929579, 0.980929579,
				0.980929579, 0.980786058, 0.980786058, 0.980642493, 0.980498838, 0.980355136, 0.980211405, 0.980067646,
				0.979923862, 0.979779939, 0.979635996, 0.979635996, 0.979491939, 0.979347811, 0.979203673, 0.97905948,
				0.978915261, 0.978771034, 0.97862673, 0.97848234, 0.978337915, 0.978193416, 0.978048864, 0.977904096,
				0.977904096, 0.977904096, 0.977759218, 0.977614286, 0.977614286, 0.977469148, 0.977469148, 0.977323732,
				0.977323732, 0.977178235, 0.977032735, 0.977032735, 0.976886973, 0.976741189, 0.976595334, 0.976595334,
				0.97644944, 0.976303261, 0.976157062, 0.976157062, 0.976010733, 0.975864345, 0.975717936, 0.975571329,
				0.975424657, 0.975277981, 0.975277981, 0.975130816, 0.974983621, 0.974836383, 0.974688984, 0.974541559,
				0.974394005, 0.974394005, 0.974246336, 0.974098684, 0.973951003, 0.973803286, 0.973803286, 0.973655448,
				0.9735076, 0.9735076, 0.973359724, 0.973359724, 0.973359724, 0.973211617, 0.973063475, 0.972915301,
				0.972767068, 0.972618729, 0.972618729, 0.972618729, 0.972469806, 0.9723209, 0.97217195, 0.972022991,
				0.972022991, 0.971873886, 0.971873886, 0.971724758, 0.971575594, 0.971426321, 0.971277045, 0.971127711,
				0.970978386, 0.970829033, 0.970679543, 0.970529911, 0.970380239, 0.970230543, 0.970080861, 0.969931177,
				0.969931177, 0.969781282, 0.969631323, 0.96948125, 0.96948125, 0.96948125, 0.969331031, 0.96918069,
				0.969030299, 0.968879913, 0.968729361, 0.968578776, 0.968578776, 0.968428031, 0.968428031, 0.968277141,
				0.968126134, 0.967975014, 0.967823816, 0.967823816, 0.967672263, 0.967520691, 0.967369106, 0.96721748,
				0.967065851, 0.966914121, 0.966914121, 0.966761864, 0.966609461, 0.966457056, 0.966304659, 0.966304659,
				0.96615218, 0.96599968, 0.965847154, 0.96569464, 0.965542127, 0.965389577, 0.965236911, 0.965084222,
				0.964931493, 0.96477871, 0.964625654, 0.964472597, 0.964319466, 0.964319466, 0.964319466, 0.964166091,
				0.964012708, 0.964012708, 0.963859309, 0.963859309, 0.963705753, 0.963552119, 0.963398495, 0.963244834,
				0.963244834, 0.963090989, 0.962937119, 0.962783229, 0.962629241, 0.962475201, 0.962475201, 0.962321109,
				0.962321109, 0.962166927, 0.962012621, 0.962012621, 0.961858275, 0.961858275, 0.961858275, 0.961703772,
				0.961549242, 0.961394631, 0.961394631, 0.961239947, 0.961085265, 0.960930579, 0.960775825, 0.960621075,
				0.96046633, 0.96046633, 0.960311517, 0.960311517, 0.960156498, 0.960001457, 0.959846314, 0.959846314,
				0.959691123, 0.959535838, 0.959380485, 0.959380485, 0.959380485, 0.959224966, 0.959069422, 0.959069422,
				0.958913783, 0.958758013, 0.958602174, 0.958446247, 0.958290283, 0.958290283, 0.958134079, 0.958134079,
				0.957977786, 0.957977786, 0.957821347, 0.957664906, 0.957508414, 0.957351906, 0.957195406, 0.957195406,
				0.957038602, 0.957038602, 0.956881665, 0.956881665, 0.956724564, 0.956567173, 0.956567173, 0.956567173,
				0.956409522, 0.956251874, 0.956251874, 0.956093963, 0.955936035, 0.95577802, 0.95562001, 0.95546186,
				0.955303543, 0.955303543, 0.955303543, 0.955145031, 0.955145031, 0.95498632, 0.954827567, 0.954668817,
				0.954509999, 0.954350797, 0.954350797, 0.954191531, 0.954032232, 0.954032232, 0.954032232, 0.953872676,
				0.953713058, 0.953713058, 0.953713058, 0.953553314, 0.953393297, 0.953393297, 0.953393297, 0.953233049,
				0.953072773, 0.952912437, 0.952752082, 0.952591679, 0.952431261, 0.952270806, 0.952270806, 0.952110202,
				0.952110202, 0.951949577, 0.951788926, 0.95162824, 0.95162824, 0.951467135, 0.951467135, 0.951467135,
				0.951305805, 0.951144472, 0.951144472, 0.950983068, 0.950821576, 0.950821576, 0.950660044, 0.950498112,
				0.950336146, 0.950174064, 0.950011698, 0.94984919, 0.94968652, 0.94968652, 0.949523814, 0.949361112,
				0.949198309, 0.949035329, 0.948872247, 0.948709118, 0.948545956, 0.948382769, 0.948219542, 0.948056099,
				0.947892635, 0.947892635, 0.947729042, 0.947565289, 0.947565289, 0.947565289, 0.947400957, 0.947400957,
				0.947400957, 0.947400957, 0.947236068, 0.947070881, 0.946905446, 0.946739948, 0.946574022, 0.946408119,
				0.946242219, 0.946076301, 0.945910346, 0.94574432, 0.94574432, 0.94574432, 0.945578159, 0.945411911,
				0.945245601, 0.945079259, 0.944912861, 0.944746432, 0.944746432, 0.944579823, 0.944413224, 0.944413224,
				0.94424654, 0.944079875, 0.943913167, 0.943913167, 0.943913167, 0.943746252, 0.943746252, 0.943579289,
				0.943579289, 0.943412276, 0.943244674, 0.943244674, 0.943244674, 0.943076754, 0.942908677, 0.9427404,
				0.94257213, 0.94257213, 0.942403623, 0.942234992, 0.942066358, 0.941897697, 0.941729045, 0.941729045,
				0.941560068, 0.94139107, 0.941222084, 0.941222084, 0.941052984, 0.940883883, 0.940714699, 0.940714699,
				0.940714699, 0.940714699, 0.940544499, 0.940374216, 0.940203716, 0.940033197, 0.939862682, 0.939862682,
				0.939692, 0.939521307, 0.939350572, 0.939179808, 0.939009048, 0.938838206, 0.938838206, 0.938667274,
				0.938496269, 0.938496269, 0.938325191, 0.938154114, 0.937982985, 0.937982985, 0.937982985, 0.937811652,
				0.93764025, 0.937468733, 0.937468733, 0.937297119, 0.937125365, 0.937125365, 0.936953606, 0.936953606,
				0.936781601, 0.936609512, 0.936609512, 0.936437136, 0.936437136, 0.936437136, 0.936437136, 0.936264558,
				0.936091924, 0.936091924, 0.935919173, 0.935746436, 0.935746436, 0.935573614, 0.935573614, 0.935400565,
				0.935400565, 0.935227352, 0.935227352, 0.935054039, 0.93488066, 0.93488066, 0.93488066, 0.93488066,
				0.93488066, 0.934706877, 0.934706877, 0.93453286, 0.93453286, 0.934358734, 0.934358734, 0.934358734,
				0.934184355, 0.934009883, 0.933835382, 0.933660655, 0.933660655, 0.93348535, 0.933309961, 0.933134454,
				0.932958948, 0.932783421, 0.932783421, 0.932607739, 0.932432013, 0.932256147, 0.932080261, 0.932080261,
				0.931904331, 0.931728386, 0.931552394, 0.931376323, 0.931200187, 0.931023659, 0.930847119, 0.930670522,
				0.930493841, 0.930317029, 0.930140233, 0.929963425, 0.929963425, 0.929786196, 0.92960889, 0.929431467,
				0.929254052, 0.929254052, 0.929076589, 0.928899094, 0.928721594, 0.928543901, 0.928366156, 0.928188391,
				0.928188391, 0.928188391, 0.928188391, 0.928010132, 0.928010132, 0.928010132, 0.928010132, 0.927830588,
				0.927830588, 0.927650892, 0.927650892, 0.927650892, 0.927470961, 0.927290984, 0.927110954, 0.926930928,
				0.926750846, 0.926570597, 0.926390265, 0.926390265, 0.926209771, 0.926029164, 0.926029164, 0.9258484,
				0.925667631, 0.925486886, 0.925306155, 0.925125447, 0.92494465, 0.92476337, 0.924582103, 0.924582103,
				0.924400614, 0.924219091, 0.924037407, 0.923855557, 0.923855557, 0.923673021, 0.92349045, 0.923307832,
				0.923125149, 0.922942219, 0.922759258, 0.922759258, 0.922575985, 0.922392729, 0.922209459, 0.92202616,
				0.921842857, 0.921659544, 0.9214762, 0.92129285, 0.92129285, 0.92110942, 0.920925905, 0.920925905,
				0.920742128, 0.920558154, 0.920374185, 0.920190075, 0.920190075, 0.920005973, 0.919821708, 0.919821708,
				0.919821708, 0.919637061, 0.919637061, 0.919637061, 0.919637061, 0.919637061, 0.91945157, 0.919266039,
				0.919080214, 0.919080214, 0.918894057, 0.918894057, 0.918894057, 0.918894057, 0.918707251, 0.918707251,
				0.918707251, 0.918520289, 0.918333226, 0.918333226, 0.918333226, 0.918333226, 0.918145741, 0.918145741,
				0.917958045, 0.91777037, 0.91777037, 0.917581672, 0.917581672, 0.917392914, 0.917204144, 0.917015326,
				0.91682648, 0.916637654, 0.916637654, 0.916637654, 0.916637654, 0.916637654, 0.916448486, 0.916448486,
				0.916448486, 0.916448486, 0.916448486, 0.916258883, 0.91606928, 0.91606928, 0.91606928, 0.915878924,
				0.915688573, 0.915498221, 0.915307811, 0.915117359, 0.915117359, 0.914926783, 0.914926783, 0.914736147,
				0.914736147, 0.914736147, 0.914545133, 0.914545133, 0.914353921, 0.914162669, 0.91397139, 0.91397139,
				0.913779925, 0.913779925, 0.913588358, 0.913588358, 0.913396735, 0.913205105, 0.913013422, 0.913013422,
				0.913013422, 0.912821613, 0.912629782, 0.91243793, 0.912246073, 0.912246073, 0.912054102, 0.911862077,
				0.911669969, 0.911477833, 0.911285667, 0.911285667, 0.911093354, 0.911093354, 0.910900461, 0.910707429,
				0.910707429, 0.910514316, 0.910514316, 0.910514316, 0.910320766, 0.910127067, 0.909932885, 0.909738717,
				0.909544394, 0.909544394, 0.909544394, 0.909544394, 0.909349962, 0.909155511, 0.908960961, 0.908960961,
				0.908766382, 0.908571816, 0.908571816, 0.908377216, 0.908377216, 0.908377216, 0.908377216, 0.908182282,
				0.90798721, 0.907792005, 0.907792005, 0.907596482, 0.907400942, 0.907205424, 0.907009689, 0.906813759,
				0.906617843, 0.906421866, 0.906225821, 0.906225821, 0.906225821, 0.906029548, 0.906029548, 0.905833157,
				0.905636748, 0.90544034, 0.905243923, 0.905047479, 0.904850995, 0.904654508, 0.904457889, 0.904261262,
				0.904261262, 0.90406417, 0.90406417, 0.903866852, 0.903866852, 0.903669411, 0.903669411, 0.903471641,
				0.903273856, 0.903076001, 0.903076001, 0.903076001, 0.902878042, 0.902680017, 0.902481943, 0.902283839,
				0.902283839, 0.902085671, 0.901887396, 0.901689094, 0.901490827, 0.901292543, 0.901094189, 0.901094189,
				0.901094189, 0.901094189, 0.901094189, 0.900894677, 0.900695157, 0.900695157, 0.900695157, 0.900494581,
				0.900494581, 0.900293989, 0.900093429, 0.899892851, 0.899892851, 0.899892851, 0.899692054, 0.899490783,
				0.899289439, 0.899088074, 0.898886697, 0.898685184, 0.898483582, 0.898281867, 0.898080177, 0.898080177,
				0.897878434, 0.897878434, 0.89767608, 0.89767608, 0.897473658, 0.897271174, 0.897271174, 0.897271174,
				0.897271174, 0.897068478, 0.896865789, 0.896865789, 0.896662944, 0.896459997, 0.89625697, 0.896053909,
				0.895850822, 0.895850822, 0.895850822, 0.895647456, 0.895443973, 0.895240363, 0.895036655, 0.894832949,
				0.894832949, 0.894629105, 0.894425268, 0.894425268, 0.894425268, 0.894221144, 0.894221144, 0.894016769,
				0.893812348, 0.893607855, 0.893403375, 0.893403375, 0.893198788, 0.893198788, 0.892994196, 0.892789521,
				0.892584705, 0.892379736, 0.892379736, 0.892174517, 0.891969152, 0.89176352, 0.89176352, 0.891557589,
				0.891351623, 0.891145606, 0.890939549, 0.890733374, 0.890527196, 0.890527196, 0.890527196, 0.890527196,
				0.890320489, 0.890320489, 0.890113522, 0.889906333, 0.88969913, 0.88949186, 0.889284527, 0.88907717,
				0.88907717, 0.888869324, 0.888869324, 0.88866143, 0.888453498, 0.888453498, 0.888245417, 0.888037247,
				0.888037247, 0.887828899, 0.887620421, 0.887620421, 0.887411662, 0.887411662, 0.887202812, 0.887202812,
				0.886993868, 0.886993868, 0.886784663, 0.886784663, 0.886575237, 0.886365741, 0.886365741, 0.886156166,
				0.885946462, 0.885946462, 0.885736507, 0.885526559, 0.885316597, 0.885106658, 0.88489668, 0.884686575,
				0.884686575, 0.884475991, 0.884265119, 0.884054145, 0.884054145, 0.883842958, 0.883631512, 0.883419625,
				0.883207684, 0.882995725, 0.882783761, 0.882783761, 0.882783761, 0.882783761, 0.882783761, 0.882783761,
				0.882571097, 0.882358417, 0.882358417, 0.88214571, 0.881932911, 0.881719974, 0.881506956, 0.881506956,
				0.881506956, 0.881293634, 0.881293634, 0.881080218, 0.880866811, 0.880653415, 0.880653415, 0.880653415,
				0.880439622, 0.880225748, 0.880011798, 0.880011798, 0.880011798, 0.879797647, 0.879797647, 0.879583449,
				0.879369274, 0.879155111, 0.879155111, 0.878940781, 0.878940781, 0.878940781, 0.878940781, 0.878726304,
				0.878726304, 0.878511588, 0.878511588, 0.878296641, 0.878081495, 0.877866352, 0.877651251, 0.877651251,
				0.877436017, 0.877220743, 0.877005315, 0.876789885, 0.876574442, 0.876359019, 0.876359019, 0.876143517,
				0.875927875, 0.875927875, 0.875712008, 0.87549583, 0.875279604, 0.875279604, 0.875063257, 0.875063257,
				0.874846856, 0.874630466, 0.874414023, 0.874197612, 0.874197612, 0.873980831, 0.8737641, 0.8737641,
				0.873547223, 0.873547223, 0.873547223, 0.873329626, 0.873329626, 0.873329626, 0.873111885, 0.872894063,
				0.872676134, 0.872458098, 0.872239907, 0.872021646, 0.872021646, 0.871803134, 0.871803134, 0.871803134,
				0.871584327, 0.871584327, 0.871584327, 0.871364909, 0.871145442, 0.870925941, 0.87070636, 0.87070636,
				0.870486585, 0.870486585, 0.870266683, 0.870046718, 0.869826657, 0.869826657, 0.869826657, 0.869826657,
				0.869605773, 0.869384926, 0.869384926, 0.869384926, 0.86916388, 0.86894288, 0.86894288, 0.868721796,
				0.868500546, 0.86827904, 0.86827904, 0.868057182, 0.868057182, 0.867835267, 0.867835267, 0.867612983,
				0.867390629, 0.867168186, 0.867168186, 0.866945329, 0.866722503, 0.866722503, 0.866499663, 0.866276562,
				0.866053333, 0.865830069, 0.865606268, 0.865382442, 0.865158579, 0.864934628, 0.864710722, 0.86448677,
				0.86448677, 0.86448677, 0.864262066, 0.86403691, 0.86403691, 0.863811654, 0.863586351, 0.86336103,
				0.86336103, 0.863135515, 0.863135515, 0.863135515, 0.862909459, 0.862909459, 0.862909459, 0.862683222,
				0.862683222, 0.862683222, 0.862456119, 0.862228986, 0.8620016, 0.861774228, 0.861774228, 0.861546488,
				0.861546488, 0.861546488, 0.861318535, 0.861090538, 0.860862527, 0.860634394, 0.860406288, 0.860406288,
				0.860406288, 0.860177924, 0.859949499, 0.859721001, 0.859721001, 0.859491909, 0.859262838, 0.859033744,
				0.858804654, 0.858575369, 0.858345848, 0.858345848, 0.858345848, 0.858345848, 0.858345848, 0.858345848,
				0.858345848, 0.858114729, 0.857883637, 0.85765257, 0.857421483, 0.857421483, 0.8571902, 0.8571902,
				0.856958914, 0.856727537, 0.856495957, 0.856264266, 0.856264266, 0.856264266, 0.856032116, 0.855800003,
				0.855567893, 0.855335747, 0.855335747, 0.855335747, 0.855335747, 0.855335747, 0.855102598, 0.855102598,
				0.855102598, 0.855102598, 0.854869061, 0.854869061, 0.854635309, 0.854635309, 0.85440122, 0.85440122,
				0.85440122, 0.85416666, 0.853931974, 0.853931974, 0.853697011, 0.853697011, 0.853697011, 0.853461803,
				0.853461803, 0.853461803, 0.853226123, 0.853226123, 0.852990148, 0.852754032, 0.852517763, 0.852281467,
				0.852281467, 0.852045038, 0.852045038, 0.85180858, 0.851571771, 0.851334657, 0.851097461, 0.850860252,
				0.850622895, 0.850622895, 0.850385374, 0.850147815, 0.849910303, 0.849672443, 0.849434301, 0.849434301,
				0.849434301, 0.849195754, 0.849195754, 0.848957171, 0.848957171, 0.84871846, 0.848479334, 0.848479334,
				0.848479334, 0.848239976, 0.848000184, 0.847760221, 0.847520006, 0.847279746, 0.847279746, 0.847279746,
				0.847279746, 0.847279746, 0.847038119, 0.847038119, 0.847038119, 0.84679514, 0.846552152, 0.846552152,
				0.846308937, 0.846065711, 0.845822093, 0.845822093, 0.845822093, 0.845577543, 0.845333009, 0.845088015,
				0.845088015, 0.844842625, 0.844842625, 0.844842625, 0.844596869, 0.844351104, 0.844351104, 0.844351104,
				0.844105122, 0.843858956, 0.843858956, 0.843612559, 0.843365896, 0.843365896, 0.843118987, 0.842872052,
				0.842624655, 0.842377306, 0.842377306, 0.842129425, 0.841881465, 0.84163335, 0.84138527, 0.841137187,
				0.841137187, 0.840888886, 0.840888886, 0.840640443, 0.840391849, 0.840143261, 0.839894647, 0.839645447,
				0.839396241, 0.839396241, 0.839396241, 0.839146507, 0.839146507, 0.839146507, 0.838896008, 0.838896008,
				0.838896008, 0.838644304, 0.838644304, 0.838391701, 0.838139045, 0.837885654, 0.837631596, 0.837377258,
				0.837122597, 0.836867669, 0.836867669, 0.836867669, 0.836867669, 0.836610954, 0.836610954, 0.836353739,
				0.836353739, 0.836096244, 0.835838789, 0.835838789, 0.835838789, 0.835838789, 0.835579453, 0.835319685,
				0.835319685, 0.835319685, 0.835319685, 0.835058371, 0.835058371, 0.834796361, 0.834796361, 0.834533356,
				0.834533356, 0.834269696, 0.834269696, 0.834269696, 0.834269696 ];
		var J = [ 1, 0.999875, 0.999749975, 0.999749975, 0.999749975, 0.999624814, 0.999624814, 0.999624814,
				0.99949949, 0.999374072, 0.999374072, 0.999248569, 0.999248569, 0.999123023, 0.998997387, 0.998997387,
				0.998997387, 0.998997387, 0.998997387, 0.998871257, 0.998745136, 0.998745136, 0.998745136, 0.998745136,
				0.998745136, 0.998745136, 0.998745136, 0.998618666, 0.998492025, 0.998492025, 0.998492025, 0.998492025,
				0.998492025, 0.998365145, 0.998365145, 0.998238163, 0.998238163, 0.998238163, 0.998110959, 0.99798351,
				0.997856069, 0.997856069, 0.997856069, 0.997856069, 0.997856069, 0.997856069, 0.997728163, 0.997728163,
				0.997728163, 0.997728163, 0.997728163, 0.997728163, 0.997728163, 0.997728163, 0.997728163, 0.997728163,
				0.997728163, 0.997598894, 0.997469611, 0.997469611, 0.997469611, 0.997469611, 0.997469611, 0.997339669,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722,
				0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997209722, 0.997076012, 0.997076012, 0.997076012,
				0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012,
				0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.997076012, 0.996941193,
				0.996941193, 0.996941193, 0.996806244, 0.996806244, 0.996670919, 0.996535466, 0.996535466, 0.996535466,
				0.996535466, 0.996535466, 0.996535466, 0.996399076, 0.996399076, 0.996399076, 0.996399076, 0.996399076,
				0.996399076, 0.996399076, 0.996399076, 0.996262428, 0.996262428, 0.996262428, 0.996262428, 0.996125497,
				0.996125497, 0.996125497, 0.996125497, 0.996125497, 0.996125497, 0.996125497, 0.996125497, 0.995987653,
				0.995849808, 0.995711894, 0.995573855, 0.995573855, 0.995573855, 0.995573855, 0.995573855, 0.995573855,
				0.995573855, 0.995573855, 0.995573855, 0.995573855, 0.995573855, 0.99543492, 0.995295968, 0.995156977,
				0.995156977, 0.995017843, 0.995017843, 0.995017843, 0.995017843, 0.995017843, 0.995017843, 0.995017843,
				0.995017843, 0.995017843, 0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994878162,
				0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994878162, 0.994737447,
				0.994596746, 0.994596746, 0.994596746, 0.994455713, 0.994455713, 0.994314623, 0.994314623, 0.994173217,
				0.994173217, 0.994173217, 0.994031466, 0.994031466, 0.994031466, 0.994031466, 0.993889473, 0.993889473,
				0.993889473, 0.993889473, 0.993747048, 0.993747048, 0.993747048, 0.993747048, 0.993747048, 0.993747048,
				0.993747048, 0.993604075, 0.993604075, 0.993604075, 0.993604075, 0.993604075, 0.993604075, 0.993604075,
				0.993460132, 0.993460132, 0.993460132, 0.993460132, 0.993460132, 0.993316069, 0.993316069, 0.993316069,
				0.993171894, 0.993171894, 0.993027653, 0.992883222, 0.992883222, 0.992883222, 0.992883222, 0.992883222,
				0.992883222, 0.992738306, 0.99259288, 0.99259288, 0.99259288, 0.99259288, 0.99259288, 0.992447192,
				0.992447192, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391,
				0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992301391, 0.992154765,
				0.992154765, 0.992154765, 0.992154765, 0.992007902, 0.991860984, 0.991860984, 0.991860984, 0.991860984,
				0.991860984, 0.991860984, 0.991860984, 0.991713502, 0.991713502, 0.991565821, 0.991565821, 0.991565821,
				0.991565821, 0.991565821, 0.991417685, 0.991417685, 0.991417685, 0.991417685, 0.991417685, 0.991417685,
				0.991417685, 0.99126892, 0.99126892, 0.99126892, 0.99126892, 0.99126892, 0.991119607, 0.991119607,
				0.991119607, 0.991119607, 0.991119607, 0.991119607, 0.991119607, 0.991119607, 0.991119607, 0.991119607,
				0.991119607, 0.991119607, 0.991119607, 0.991119607, 0.990969335, 0.990818996, 0.990818996, 0.990818996,
				0.99066847, 0.99066847, 0.990517911, 0.990517911, 0.990517911, 0.990517911, 0.990517911, 0.990366963,
				0.990366963, 0.990366963, 0.990366963, 0.990366963, 0.990366963, 0.990215666, 0.990215666, 0.990064268,
				0.990064268, 0.990064268, 0.989912695, 0.989912695, 0.989761073, 0.989609461, 0.989609461, 0.989609461,
				0.989609461, 0.989457535, 0.989457535, 0.989457535, 0.989457535, 0.989457535, 0.989457535, 0.989457535,
				0.98930532, 0.98930532, 0.989153025, 0.989153025, 0.989153025, 0.989153025, 0.989000471, 0.989000471,
				0.989000471, 0.989000471, 0.988847594, 0.988694613, 0.988694613, 0.988694613, 0.988541473, 0.988541473,
				0.988541473, 0.988541473, 0.988541473, 0.988541473, 0.988387775, 0.988387775, 0.988233876, 0.988233876,
				0.988079806, 0.988079806, 0.988079806, 0.988079806, 0.988079806, 0.988079806, 0.987925306, 0.987925306,
				0.987770672, 0.987770672, 0.98761584, 0.98761584, 0.98761584, 0.987460339, 0.987304769, 0.987304769,
				0.987304769, 0.987148887, 0.987148887, 0.987148887, 0.987148887, 0.987148887, 0.987148887, 0.987148887,
				0.986992409, 0.986835926, 0.986835926, 0.986679214, 0.986679214, 0.986679214, 0.986679214, 0.986679214,
				0.986679214, 0.986521493, 0.986521493, 0.986521493, 0.98636348, 0.986205372, 0.986205372, 0.986205372,
				0.986047066, 0.985888678, 0.985888678, 0.985888678, 0.985730091, 0.985571407, 0.985571407, 0.985571407,
				0.985571407, 0.985571407, 0.985571407, 0.985571407, 0.985571407, 0.985412287, 0.985412287, 0.985253038,
				0.985253038, 0.985253038, 0.985253038, 0.985093418, 0.985093418, 0.984933574, 0.984773697, 0.984773697,
				0.984773697, 0.984613737, 0.984613737, 0.984613737, 0.984453548, 0.984453548, 0.984453548, 0.984453548,
				0.984453548, 0.984453548, 0.984453548, 0.984453548, 0.984291646, 0.984291646, 0.984291646, 0.984291646,
				0.984291646, 0.984291646, 0.984291646, 0.984291646, 0.984291646, 0.984291646, 0.984291646, 0.984291646,
				0.984128609, 0.984128609, 0.984128609, 0.98396519, 0.983801612, 0.983801612, 0.983637749, 0.983473826,
				0.983309857, 0.983309857, 0.983309857, 0.983309857, 0.983309857, 0.983309857, 0.983309857, 0.983309857,
				0.983309857, 0.983309857, 0.983309857, 0.983144714, 0.982979562, 0.982979562, 0.982979562, 0.982979562,
				0.982979562, 0.982979562, 0.982979562, 0.982813679, 0.982813679, 0.982813679, 0.982647674, 0.982647674,
				0.982647674, 0.982647674, 0.982481451, 0.982315219, 0.982315219, 0.982148883, 0.982148883, 0.9819825,
				0.9819825, 0.9819825, 0.981815745, 0.98164875, 0.98164875, 0.98164875, 0.98164875, 0.98164875,
				0.981480977, 0.981480977, 0.981480977, 0.981480977, 0.981480977, 0.981480977, 0.981312698, 0.981312698,
				0.981312698, 0.981312698, 0.981144025, 0.981144025, 0.981144025, 0.981144025, 0.980974895, 0.980805655,
				0.980636379, 0.980636379, 0.980636379, 0.980636379, 0.980636379, 0.980636379, 0.980466422, 0.980466422,
				0.980466422, 0.980466422, 0.980466422, 0.980466422, 0.980466422, 0.980296002, 0.980296002, 0.980296002,
				0.980125403, 0.980125403, 0.980125403, 0.980125403, 0.979954544, 0.979783689, 0.979783689, 0.979783689,
				0.979783689, 0.979612514, 0.979612514, 0.979612514, 0.979441192, 0.979441192, 0.979269713, 0.979269713,
				0.979269713, 0.979097927, 0.979097927, 0.978925803, 0.978753693, 0.978581589, 0.978581589, 0.978581589,
				0.978409308, 0.978409308, 0.978409308, 0.978236995, 0.978236995, 0.978064439, 0.978064439, 0.977891669,
				0.977891669, 0.977718833, 0.977718833, 0.977718833, 0.977545703, 0.97737253, 0.977199362, 0.977026106,
				0.977026106, 0.976852415, 0.976852415, 0.976678587, 0.976678587, 0.97650454, 0.976330485, 0.976330485,
				0.976330485, 0.976330485, 0.976330485, 0.976155656, 0.976155656, 0.976155656, 0.976155656, 0.976155656,
				0.976155656, 0.975980387, 0.975980387, 0.975980387, 0.975980387, 0.975980387, 0.97580475, 0.97580475,
				0.97580475, 0.97580475, 0.97580475, 0.97580475, 0.97580475, 0.97580475, 0.97580475, 0.97580475,
				0.97580475, 0.97580475, 0.97580475, 0.975627656, 0.975627656, 0.975627656, 0.975627656, 0.975627656,
				0.975450148, 0.975450148, 0.975450148, 0.975450148, 0.975450148, 0.975450148, 0.975450148, 0.975272007,
				0.975093622, 0.97491523, 0.97491523, 0.974735951, 0.974556502, 0.974376722, 0.974376722, 0.974196694,
				0.974196694, 0.974016567, 0.973836436, 0.973836436, 0.973836436, 0.973836436, 0.973836436, 0.973836436,
				0.973836436, 0.973836436, 0.973655211, 0.973655211, 0.973655211, 0.973473809, 0.973473809, 0.973473809,
				0.973473809, 0.973473809, 0.973473809, 0.973473809, 0.973473809, 0.973473809, 0.973291342, 0.973291342,
				0.973291342, 0.973291342, 0.973291342, 0.973107918, 0.973107918, 0.973107918, 0.973107918, 0.973107918,
				0.973107918, 0.973107918, 0.972923354, 0.972923354, 0.972923354, 0.972923354, 0.972923354, 0.972923354,
				0.972923354, 0.972923354, 0.972923354, 0.972738278, 0.972738278, 0.972738278, 0.972552569, 0.972552569,
				0.972552569, 0.972552569, 0.972552569, 0.972366529, 0.972366529, 0.972366529, 0.972180222, 0.971993778,
				0.971993778, 0.971807035, 0.971620292, 0.971433371, 0.971246275, 0.971246275, 0.971246275, 0.971246275,
				0.971058415, 0.971058415, 0.970870242, 0.970681764, 0.970493191, 0.970493191, 0.970304368, 0.970115428,
				0.970115428, 0.970115428, 0.969926309, 0.969737177, 0.969547972, 0.969547972, 0.969358373, 0.969358373,
				0.969358373, 0.96916841, 0.96916841, 0.96897777, 0.96897777, 0.96897777, 0.96897777, 0.96897777,
				0.96897777, 0.968786741, 0.968595736, 0.968404695, 0.968213645, 0.968213645, 0.968022524, 0.967831404,
				0.967640143, 0.967448873, 0.967448873, 0.967448873, 0.967257217, 0.967065403, 0.967065403, 0.967065403,
				0.967065403, 0.967065403, 0.967065403, 0.966873154, 0.966873154, 0.966680707, 0.966680707, 0.966488246,
				0.966295792, 0.966295792, 0.966103036, 0.966103036, 0.966103036, 0.966103036, 0.965909862, 0.965909862,
				0.965716459, 0.965716459, 0.965523, 0.965523, 0.965523, 0.965523, 0.965329397, 0.965135795,
				0.965135795, 0.965135795, 0.965135795, 0.965135795, 0.964941835, 0.964941835, 0.964941835, 0.964941835,
				0.964941835, 0.964941835, 0.964747448, 0.964747448, 0.964552916, 0.964552916, 0.964552916, 0.964357637,
				0.964357637, 0.964162178, 0.963966442, 0.963966442, 0.963966442, 0.963966442, 0.963966442, 0.963966442,
				0.963769585, 0.963572713, 0.963375873, 0.963375873, 0.963375873, 0.963375873, 0.963178768, 0.963178768,
				0.963178768, 0.962981637, 0.962981637, 0.962784322, 0.962587004, 0.962389706, 0.962389706, 0.962389706,
				0.962389706, 0.962191679, 0.962191679, 0.962191679, 0.962191679, 0.962191679, 0.962191679, 0.962191679,
				0.962191679, 0.962191679, 0.961992446, 0.961793152, 0.961793152, 0.961593797, 0.961593797, 0.961593797,
				0.961593797, 0.961593797, 0.961593797, 0.961593797, 0.961593797, 0.961593797, 0.961593797, 0.961393617,
				0.961393617, 0.96119295, 0.96119295, 0.960992192, 0.960992192, 0.960791335, 0.960791335, 0.960791335,
				0.960791335, 0.960590128, 0.960388894, 0.960388894, 0.960388894, 0.960388894, 0.960388894, 0.960187236,
				0.960187236, 0.960187236, 0.960187236, 0.960187236, 0.960187236, 0.960187236, 0.959985073, 0.95978257,
				0.959579963, 0.95937728, 0.95937728, 0.95937728, 0.959174192, 0.958970732, 0.958970732, 0.958767228,
				0.958767228, 0.958767228, 0.958767228, 0.958563579, 0.958359953, 0.958359953, 0.958359953, 0.958359953,
				0.958359953, 0.958359953, 0.958359953, 0.958359953, 0.958359953, 0.958359953, 0.958155188, 0.958155188,
				0.957949898, 0.957949898, 0.957744605, 0.957744605, 0.957744605, 0.957538903, 0.957333176, 0.957127484,
				0.957127484, 0.957127484, 0.956921677, 0.956921677, 0.956921677, 0.956921677, 0.956921677, 0.956921677,
				0.956715018, 0.956508327, 0.956508327, 0.956508327, 0.956508327, 0.956508327, 0.956508327, 0.956301061,
				0.956301061, 0.956301061, 0.956093625, 0.955885925, 0.955885925, 0.955677982, 0.955677982, 0.955677982,
				0.955677982, 0.955677982, 0.955469603, 0.955469603, 0.955261168, 0.955261168, 0.955261168, 0.955261168,
				0.955261168, 0.955052243, 0.955052243, 0.955052243, 0.955052243, 0.954842663, 0.954842663, 0.954842663,
				0.954842663, 0.954842663, 0.954842663, 0.954842663, 0.954632487, 0.954422064, 0.954211625, 0.954211625,
				0.954000999, 0.954000999, 0.954000999, 0.954000999, 0.954000999, 0.954000999, 0.954000999, 0.953789321,
				0.953789321, 0.953577535, 0.953577535, 0.953577535, 0.953365599, 0.953365599, 0.953365599, 0.953153362,
				0.953153362, 0.953153362, 0.95294079, 0.95294079, 0.952727993, 0.952727993, 0.952515047, 0.952515047,
				0.952301929, 0.952301929, 0.952088318, 0.952088318, 0.952088318, 0.951874354, 0.951874354, 0.951874354,
				0.951660125, 0.951660125, 0.951660125, 0.951660125, 0.951660125, 0.951660125, 0.951660125, 0.951445215,
				0.951445215, 0.951445215, 0.951445215, 0.951229428, 0.951229428, 0.951229428, 0.951229428, 0.951229428,
				0.951229428, 0.951229428, 0.95101268, 0.950795936, 0.950579034, 0.950362113, 0.95014514, 0.95014514,
				0.95014514, 0.949928087, 0.949928087, 0.949928087, 0.949928087, 0.949928087, 0.949710101, 0.949491975,
				0.949491975, 0.949273859, 0.949273859, 0.949273859, 0.949273859, 0.94905544, 0.948837029, 0.948837029,
				0.948837029, 0.948837029, 0.94861825, 0.948399505, 0.948399505, 0.94818057, 0.94818057, 0.94818057,
				0.94818057, 0.947961442, 0.947961442, 0.947742124, 0.947522736, 0.947303363, 0.947303363, 0.947083958,
				0.947083958, 0.946864169, 0.946864169, 0.946864169, 0.946864169, 0.946864169, 0.946643929, 0.946643929,
				0.946643929, 0.946643929, 0.946643929, 0.946643929, 0.946643929, 0.946423066, 0.946423066, 0.946423066,
				0.946201846, 0.946201846, 0.946201846, 0.946201846, 0.945980086, 0.945980086, 0.945758099, 0.945758099,
				0.945758099, 0.945758099, 0.945758099, 0.945535433, 0.945535433, 0.945535433, 0.945312677, 0.945312677,
				0.945089264, 0.944865716, 0.944865716, 0.944641994, 0.944418189, 0.944418189, 0.944418189, 0.944418189,
				0.944418189, 0.944418189, 0.944418189, 0.944193518, 0.944193518, 0.943968671, 0.943743635, 0.943743635,
				0.943518392, 0.943292765, 0.943292765, 0.943292765, 0.943292765, 0.943292765, 0.943066362, 0.943066362,
				0.942839755, 0.942839755, 0.942839755, 0.942839755, 0.942612712, 0.942385146, 0.942157366, 0.942157366,
				0.942157366, 0.941929415, 0.941701485, 0.941701485, 0.941701485, 0.94147336, 0.94147336, 0.94147336,
				0.94147336, 0.941244445, 0.941244445, 0.941015146, 0.941015146, 0.940785803, 0.940785803, 0.940785803,
				0.940785803, 0.940555549, 0.940555549, 0.940555549, 0.940325057, 0.940325057, 0.940325057, 0.940325057,
				0.940325057, 0.940325057, 0.940325057, 0.940325057, 0.940325057, 0.940325057, 0.940325057, 0.940092869,
				0.939860384, 0.939860384, 0.939860384, 0.939626721, 0.939626721, 0.939626721, 0.939626721, 0.939392719,
				0.939392719, 0.939158668, 0.938924584, 0.938924584, 0.938689993, 0.93845542, 0.93845542, 0.938220247,
				0.937984507, 0.937984507, 0.937984507, 0.937984507, 0.937984507, 0.93774803, 0.93774803, 0.937511521,
				0.937275029, 0.937275029, 0.937275029, 0.937275029, 0.937275029, 0.937275029, 0.937037926, 0.936800846,
				0.936800846, 0.936800846, 0.936800846, 0.936563267, 0.936563267, 0.936563267, 0.936563267, 0.936563267,
				0.936563267, 0.936563267, 0.936324802, 0.936086358, 0.935847742, 0.93560844, 0.935369151, 0.935129742,
				0.935129742, 0.935129742, 0.935129742, 0.935129742, 0.934890052, 0.934890052, 0.934650291, 0.934650291,
				0.934650291, 0.934650291, 0.934650291, 0.934409759, 0.93416883, 0.93416883, 0.93416883, 0.93416883,
				0.93416883, 0.933927639, 0.933686455, 0.933445129, 0.933203834, 0.933203834, 0.932961893, 0.932719908,
				0.932477803, 0.932477803, 0.932235535, 0.932235535, 0.931992961, 0.931992961, 0.931750231, 0.931507425,
				0.931507425, 0.931507425, 0.931264198, 0.931264198, 0.931020823, 0.930777154, 0.930777154, 0.930533206,
				0.930289243, 0.930289243, 0.930044922, 0.930044922, 0.930044922, 0.930044922, 0.930044922, 0.929799595,
				0.929799595, 0.929554188, 0.929554188, 0.929554188, 0.929554188, 0.929554188, 0.929554188, 0.929554188,
				0.929307124, 0.929307124, 0.929307124, 0.929307124, 0.929307124, 0.929307124, 0.9290593, 0.928811343,
				0.928811343, 0.928563277, 0.928563277, 0.928315081, 0.928315081, 0.928315081, 0.928066105, 0.927816836,
				0.927816836, 0.927816836, 0.927816836, 0.927816836, 0.927816836, 0.927565685, 0.927314176, 0.927062623,
				0.926810973, 0.926810973, 0.926558508, 0.926305407, 0.926305407, 0.926305407, 0.926051934, 0.926051934,
				0.926051934, 0.926051934, 0.925797383, 0.925542634, 0.925542634, 0.925542634, 0.925542634, 0.925286994,
				0.925286994, 0.925030852, 0.924774683, 0.924774683, 0.924774683, 0.924518252, 0.924261832, 0.924261832,
				0.924261832, 0.924005098, 0.924005098, 0.924005098, 0.923747652, 0.923747652, 0.923747652, 0.923747652,
				0.923747652, 0.923489861, 0.923489861, 0.923489861, 0.923489861, 0.923489861, 0.923489861, 0.923231108,
				0.923231108, 0.92297226, 0.92297226, 0.92297226, 0.92297226, 0.92297226, 0.92297226, 0.92297226,
				0.922712142, 0.922451691, 0.922451691, 0.922190917, 0.92192965, 0.92192965, 0.921667895, 0.921405713,
				0.921405713, 0.921142921, 0.921142921, 0.921142921, 0.921142921, 0.921142921, 0.921142921, 0.921142921,
				0.921142921, 0.920875821, 0.920608343, 0.920340619, 0.920340619, 0.920071807, 0.920071807, 0.919802827,
				0.919802827, 0.919802827, 0.919533419, 0.919263755, 0.918993286, 0.918993286, 0.918993286, 0.918721812,
				0.918448957, 0.918176028, 0.918176028, 0.917902463, 0.917902463, 0.917628025, 0.917628025, 0.917353132,
				0.917353132, 0.917077455, 0.916801735, 0.916525788 ];
		var F = new Array(1500);
		var G = new Array(1500);
		var K = new Array(1500);
		var M = new Array(1500);
		var Q2 = (isMale) ? 1 : 0;
		var Q3 = Math.log(age);
		var Q4 = Math.log(systolicBp);
		var Q5 = (smoker) ? 1 : 0;
		var Q6 = (treatedBp) ? 1 : 0;
		var Q7 = Math.log(BMI);
		var Q8 = (diabetic) ? 1 : 0;
		var R2 = 0.54089;
		var R3 = 2.7684;
		var R4 = 1.69824;
		var R5 = 0.68916;
		var R6 = 0.53163;
		var R7 = 1.01325;
		var R8 = 0.79624;
		var S2 = Q2 * R2;
		var S3 = Q3 * R3;
		var S4 = Q4 * R4;
		var S5 = Q5 * R5;
		var S6 = Q6 * R6;
		var S7 = Q7 * R7;
		var S8 = Q8 * R8;
		var S10 = S2 + S3 + S4 + S5 + S6 + S7 + S8;
		var T2 = 0.47835;
		var T3 = 3.43911;
		var T4 = 1.57043;
		var T5 = 0.98257;
		var T6 = 0.18871;
		var T7 = -0.52377;
		var T8 = 0.51411;
		var U2 = Q2 * T2;
		var U3 = Q3 * T3;
		var U4 = Q4 * T4;
		var U5 = Q5 * T5;
		var U6 = Q6 * T6;
		var U7 = Q7 * T7;
		var U8 = Q8 * T8;
		var U10 = U2 + U3 + U4 + U5 + U6 + U7 + U8;
		var W2 = 21.89281378;
		var X2 = 18.82684236;
		var W5 = Math.exp(S10 - W2);
		var X5 = Math.exp(U10 - X2);
		// set F
		for ( i = 0; i < E.length && i < F.length; i++) {
			F[i] = Math.pow(E[i], W5);
		}
		// set G
		for ( i = 0; i + 1 < E.length; i++) {
			G[i] = Math.log(E[i]) - Math.log(E[i + 1]);
		}
		// set K
		for ( i = 0; i < K.length && i < J.length; i++) {
			K[i] = Math.pow(J[i], X5);
		}
		// set M
		M[0] = W5 * (-Math.log(E[0]));
		for ( i = 0; i + 1 < M.length && i < F.length && i < K.length && i < G.length; i++) {
			M[i + 1] = F[i] * K[i] * W5 * G[i];
		}
		// now we can calculate the risk values
		var fullRisk = 0;
		for ( i = 0; i < M.length && !isNaN(M[i]); i++) {
			fullRisk = fullRisk + M[i];
		}

		return Math.round(100*fullRisk);
	}

	function calculateHardRiskBmiInternal( age, isMale,  systolicBp, smoker, treatedBp, diabetic, BMI) {
		var i=0;  // loop invariant
		var E = [ 0.999886631, 0.999886631, 0.999886631, 0.999773182, 0.999659708, 0.999659708, 0.999546127,
				0.999546127, 0.999546127, 0.999432393, 0.999432393, 0.999318617, 0.999318617, 0.999318617, 0.999204687,
				0.999090701, 0.998976654, 0.998862521, 0.998862521, 0.998862521, 0.998748247, 0.998748247, 0.998633852,
				0.998519451, 0.998519451, 0.998519451, 0.998404804, 0.998290128, 0.998175404, 0.998175404, 0.998060641,
				0.998060641, 0.997945825, 0.997945825, 0.997945825, 0.997945825, 0.997830584, 0.997715315, 0.997600014,
				0.997600014, 0.997484514, 0.99736865, 0.997252699, 0.997136706, 0.997020685, 0.996904572, 0.996788278,
				0.996671866, 0.996671866, 0.996671866, 0.996555198, 0.996438383, 0.996321272, 0.996321272, 0.996321272,
				0.996203964, 0.996086546, 0.995969071, 0.995851565, 0.995734062, 0.995616498, 0.995498817, 0.995380944,
				0.995263001, 0.995144774, 0.995026507, 0.994908252, 0.994789805, 0.994789805, 0.994671351, 0.994552878,
				0.994434352, 0.994315831, 0.994315831, 0.99419721, 0.99419721, 0.99407826, 0.99407826, 0.99407826,
				0.99407826, 0.99395904, 0.993839803, 0.993720551, 0.99360128, 0.99360128, 0.99360128, 0.993481808,
				0.993362157, 0.993242397, 0.993122593, 0.993002761, 0.993002761, 0.993002761, 0.993002761, 0.993002761,
				0.992882535, 0.992762246, 0.99264195, 0.992521648, 0.992401329, 0.992281005, 0.992281005, 0.992160589,
				0.992160589, 0.992160589, 0.99203974, 0.99203974, 0.991918857, 0.991797937, 0.991676993, 0.991676993,
				0.991555951, 0.991434843, 0.991313727, 0.991192515, 0.991071279, 0.990950039, 0.990828723, 0.990707375,
				0.990585982, 0.990464374, 0.990464374, 0.990342716, 0.990342716, 0.990220903, 0.990099048, 0.989977186,
				0.989977186, 0.989854921, 0.989732647, 0.989732647, 0.989610111, 0.989487473, 0.989487473, 0.989364779,
				0.98924208, 0.98924208, 0.989119144, 0.988996138, 0.988996138, 0.988873103, 0.988750049, 0.988750049,
				0.988626871, 0.988503637, 0.988380392, 0.988256951, 0.988133448, 0.988009944, 0.988009944, 0.987885869,
				0.987761636, 0.987761636, 0.987637299, 0.98751293, 0.98751293, 0.987388451, 0.987263964, 0.987139413,
				0.987139413, 0.98701484, 0.98701484, 0.98701484, 0.986890087, 0.986765303, 0.986640488, 0.986640488,
				0.986640488, 0.986515077, 0.986389511, 0.986389511, 0.986263795, 0.986263795, 0.986137965, 0.98601208,
				0.985886201, 0.98576019, 0.98576019, 0.985634017, 0.985634017, 0.985634017, 0.985507597, 0.985381063,
				0.985381063, 0.985254334, 0.985254334, 0.98512748, 0.985000515, 0.984873438, 0.984873438, 0.984745896,
				0.984618336, 0.984490687, 0.984490687, 0.984490687, 0.984362302, 0.984233899, 0.984233899, 0.984233899,
				0.984105093, 0.984105093, 0.984105093, 0.983976102, 0.983976102, 0.983847024, 0.983717927, 0.983588774,
				0.983459603, 0.983330385, 0.983330385, 0.983200981, 0.983200981, 0.983200981, 0.983071492, 0.983071492,
				0.983071492, 0.982941761, 0.982941761, 0.982811954, 0.982682146, 0.982552337, 0.982422463, 0.982292552,
				0.982162645, 0.982162645, 0.98203268, 0.981902698, 0.981772697, 0.981772697, 0.981642525, 0.981642525,
				0.9815123, 0.981381991, 0.981381991, 0.981381991, 0.98125149, 0.98125149, 0.981120919, 0.980990204,
				0.980859435, 0.980728596, 0.980597723, 0.980597723, 0.980466721, 0.980335694, 0.980335694, 0.980204585,
				0.980204585, 0.980204585, 0.980072912, 0.980072912, 0.979941063, 0.979941063, 0.979809125, 0.979809125,
				0.979677039, 0.979677039, 0.979677039, 0.979544518, 0.979544518, 0.979411754, 0.97927891, 0.979146068,
				0.979146068, 0.979146068, 0.979012937, 0.979012937, 0.978879628, 0.978746282, 0.978612884, 0.978612884,
				0.978479426, 0.978345938, 0.978345938, 0.978345938, 0.978345938, 0.978212218, 0.978212218, 0.978212218,
				0.978212218, 0.978078262, 0.977944261, 0.977810249, 0.977676191, 0.977541958, 0.977541958, 0.977407567,
				0.977407567, 0.97727305, 0.97727305, 0.977138407, 0.977003739, 0.977003739, 0.976868743, 0.976868743,
				0.976868743, 0.976733635, 0.976733635, 0.976733635, 0.976598298, 0.97646287, 0.97646287, 0.97646287,
				0.976327021, 0.976191177, 0.976055221, 0.975919226, 0.975783081, 0.975783081, 0.975783081, 0.975646849,
				0.975510468, 0.975510468, 0.975373687, 0.97523687, 0.97523687, 0.975099949, 0.975099949, 0.975099949,
				0.975099949, 0.974962505, 0.974824557, 0.974686407, 0.974548241, 0.974410042, 0.974410042, 0.974410042,
				0.97427171, 0.974133299, 0.973994778, 0.973994778, 0.973856178, 0.973856178, 0.973717398, 0.973717398,
				0.973578516, 0.973439648, 0.973439648, 0.973439648, 0.973300605, 0.973300605, 0.973161525, 0.973022434,
				0.972883257, 0.972883257, 0.972744011, 0.972604209, 0.972604209, 0.972464256, 0.972464256, 0.972324226,
				0.972184203, 0.972044111, 0.971903893, 0.97176363, 0.971623176, 0.971623176, 0.971482518, 0.971341745,
				0.971200968, 0.971060168, 0.971060168, 0.970919097, 0.970778008, 0.970636925, 0.970636925, 0.970495752,
				0.970354576, 0.970213345, 0.97007185, 0.969930191, 0.969930191, 0.969930191, 0.969930191, 0.969787849,
				0.969645485, 0.969645485, 0.969502565, 0.969502565, 0.969359524, 0.96921647, 0.96921647, 0.969073343,
				0.969073343, 0.96892995, 0.968786516, 0.968786516, 0.968786516, 0.968642928, 0.968499275, 0.968499275,
				0.96835547, 0.96835547, 0.968211532, 0.96806746, 0.96806746, 0.967923011, 0.967778484, 0.967633838,
				0.967489096, 0.967344295, 0.967344295, 0.967199305, 0.967054247, 0.967054247, 0.967054247, 0.967054247,
				0.966909023, 0.966763748, 0.966763748, 0.966618372, 0.96647293, 0.966327499, 0.966181853, 0.966181853,
				0.966181853, 0.966181853, 0.966181853, 0.966035946, 0.966035946, 0.966035946, 0.966035946, 0.966035946,
				0.965889721, 0.965889721, 0.965889721, 0.965743193, 0.965743193, 0.965596538, 0.965596538, 0.965596538,
				0.965449652, 0.965302661, 0.965155673, 0.965155673, 0.965155673, 0.965008348, 0.965008348, 0.964860987,
				0.96471357, 0.964566105, 0.964418255, 0.964418255, 0.964270229, 0.964270229, 0.964121776, 0.963973267,
				0.963973267, 0.963824708, 0.963676126, 0.963527338, 0.963527338, 0.963527338, 0.963527338, 0.963378317,
				0.963378317, 0.963378317, 0.963378317, 0.963378317, 0.963228013, 0.963228013, 0.963228013, 0.963228013,
				0.963228013, 0.963077194, 0.962926222, 0.962775245, 0.962775245, 0.962624134, 0.962472922, 0.962472922,
				0.962321576, 0.962170232, 0.962018905, 0.962018905, 0.961867483, 0.961715912, 0.961564113, 0.961412277,
				0.961260103, 0.961260103, 0.961107719, 0.960955306, 0.960802878, 0.960650324, 0.960650324, 0.960497272,
				0.960344201, 0.960344201, 0.96019082, 0.96019082, 0.960037357, 0.959883868, 0.959730376, 0.959576293,
				0.959422205, 0.959422205, 0.959422205, 0.959268013, 0.959268013, 0.959113818, 0.958959575, 0.958805307,
				0.958805307, 0.958805307, 0.958805307, 0.958805307, 0.958805307, 0.958805307, 0.958649936, 0.958494531,
				0.958338879, 0.958338879, 0.958338879, 0.958338879, 0.958338879, 0.958182476, 0.958026046, 0.958026046,
				0.958026046, 0.958026046, 0.958026046, 0.958026046, 0.958026046, 0.958026046, 0.957868818, 0.957868818,
				0.957710727, 0.957710727, 0.957552481, 0.957394232, 0.957235893, 0.957077569, 0.957077569, 0.957077569,
				0.957077569, 0.956919028, 0.956760399, 0.956760399, 0.956601719, 0.956601719, 0.956601719, 0.956601719,
				0.956601719, 0.956442722, 0.956442722, 0.956442722, 0.95628345, 0.956123917, 0.956123917, 0.956123917,
				0.956123917, 0.956123917, 0.955964065, 0.955964065, 0.955964065, 0.955804077, 0.955804077, 0.955804077,
				0.95564368, 0.95564368, 0.955483108, 0.955483108, 0.955483108, 0.955322359, 0.955322359, 0.955161582,
				0.955000798, 0.955000798, 0.955000798, 0.95483988, 0.954678744, 0.954678744, 0.954517577, 0.954356365,
				0.954195104, 0.954033679, 0.953872235, 0.953710721, 0.953548984, 0.953548984, 0.953387126, 0.953387126,
				0.953387126, 0.953387126, 0.953387126, 0.953387126, 0.953223896, 0.953060098, 0.952896185, 0.952896185,
				0.952896185, 0.952896185, 0.952732197, 0.952568124, 0.952568124, 0.952568124, 0.952568124, 0.952403967,
				0.952403967, 0.95223979, 0.95223979, 0.952075393, 0.952075393, 0.951910724, 0.95174604, 0.951581366,
				0.951581366, 0.951416534, 0.951416534, 0.951416534, 0.951251446, 0.951086341, 0.950921236, 0.950921236,
				0.950755882, 0.950590373, 0.950590373, 0.950590373, 0.950590373, 0.950424544, 0.9502587, 0.9502587,
				0.950092454, 0.950092454, 0.949926185, 0.949926185, 0.949759845, 0.949593459, 0.949427029, 0.949260571,
				0.949260571, 0.94909406, 0.948927457, 0.948760844, 0.948760844, 0.948760844, 0.9485937, 0.9485937,
				0.9485937, 0.948426195, 0.948258687, 0.948090148, 0.947921452, 0.947752748, 0.947752748, 0.947752748,
				0.947752748, 0.947583266, 0.947583266, 0.947583266, 0.947413642, 0.947244, 0.947074234, 0.947074234,
				0.946904383, 0.946904383, 0.946904383, 0.946734379, 0.946734379, 0.946734379, 0.946734379, 0.946564224,
				0.946564224, 0.946393328, 0.94622234, 0.94622234, 0.94622234, 0.946051104, 0.946051104, 0.946051104,
				0.945879648, 0.945708192, 0.945708192, 0.945536623, 0.945365058, 0.945365058, 0.945365058, 0.945193265,
				0.945021368, 0.944849408, 0.944849408, 0.944849408, 0.944677296, 0.944505151, 0.944332945, 0.944160749,
				0.944160749, 0.944160749, 0.943988322, 0.943815788, 0.943815788, 0.943643103, 0.943470374, 0.943297567,
				0.943124698, 0.943124698, 0.943124698, 0.942951442, 0.942951442, 0.942777851, 0.942777851, 0.942604052,
				0.942604052, 0.942430067, 0.942256058, 0.942256058, 0.942256058, 0.942256058, 0.942256058, 0.942256058,
				0.942081356, 0.941906396, 0.941906396, 0.941731247, 0.941731247, 0.941556068, 0.941380854, 0.941380854,
				0.941205472, 0.941205472, 0.941029944, 0.940854441, 0.940854441, 0.9406787, 0.9406787, 0.9406787,
				0.9406787, 0.940502645, 0.940502645, 0.940502645, 0.940326317, 0.940149937, 0.939973454, 0.939796956,
				0.939796956, 0.939620305, 0.939620305, 0.939443421, 0.939266539, 0.939089645, 0.938912767, 0.938912767,
				0.938735464, 0.938735464, 0.938557783, 0.938379855, 0.938379855, 0.938379855, 0.938379855, 0.938379855,
				0.938379855, 0.938201375, 0.938022886, 0.937844404, 0.937844404, 0.937665695, 0.937665695, 0.937665695,
				0.93748662, 0.937307441, 0.937307441, 0.937307441, 0.937307441, 0.937307441, 0.937307441, 0.937307441,
				0.937307441, 0.937127527, 0.937127527, 0.937127527, 0.936947454, 0.936947454, 0.93676735, 0.93676735,
				0.936587002, 0.936587002, 0.936587002, 0.936587002, 0.936406548, 0.936406548, 0.936406548, 0.93622576,
				0.936045, 0.936045, 0.935864151, 0.935683317, 0.935683317, 0.935683317, 0.935502063, 0.935320701,
				0.935320701, 0.935139161, 0.934957289, 0.934775351, 0.934775351, 0.934775351, 0.934593269, 0.934593269,
				0.934411105, 0.934228973, 0.934228973, 0.934228973, 0.934228973, 0.934228973, 0.934045692, 0.934045692,
				0.934045692, 0.933862299, 0.933862299, 0.933678218, 0.933678218, 0.933678218, 0.933678218, 0.933678218,
				0.933493513, 0.933493513, 0.933493513, 0.933308305, 0.933123069, 0.932937764, 0.932937764, 0.932937764,
				0.932937764, 0.932937764, 0.93275208, 0.93275208, 0.93275208, 0.93275208, 0.932565601, 0.932565601,
				0.932379032, 0.932379032, 0.932192416, 0.932192416, 0.932005714, 0.932005714, 0.931818998, 0.931818998,
				0.931818998, 0.931818998, 0.93163143, 0.93163143, 0.931443628, 0.931255751, 0.931255751, 0.931067544,
				0.931067544, 0.930879319, 0.93069079, 0.93069079, 0.930501609, 0.930312406, 0.930123171, 0.929933858,
				0.929933858, 0.929933858, 0.929933858, 0.929743733, 0.929553098, 0.929553098, 0.929362407, 0.929171651,
				0.928980882, 0.928789999, 0.928789999, 0.928789999, 0.928789999, 0.928789999, 0.928598604, 0.928407194,
				0.928407194, 0.928407194, 0.928215033, 0.928215033, 0.928215033, 0.928022402, 0.927829579, 0.927829579,
				0.927829579, 0.927829579, 0.927636214, 0.927442758, 0.927442758, 0.927442758, 0.927442758, 0.92724829,
				0.927053732, 0.927053732, 0.927053732, 0.926858748, 0.926858748, 0.926858748, 0.926858748, 0.926858748,
				0.926858748, 0.926661889, 0.926465052, 0.926465052, 0.926465052, 0.926268058, 0.926070643, 0.926070643,
				0.926070643, 0.926070643, 0.925872581, 0.925674548, 0.925674548, 0.925674548, 0.925674548, 0.925674548,
				0.925674548, 0.925674548, 0.925674548, 0.925674548, 0.925674548, 0.925674548, 0.925674548, 0.925474528,
				0.925474528, 0.925474528, 0.925474528, 0.925274197, 0.925274197, 0.925073608, 0.924872954, 0.924872954,
				0.924872954, 0.924872954, 0.924671334, 0.924671334, 0.924671334, 0.924671334, 0.924469211, 0.924265953,
				0.924062578, 0.924062578, 0.923859099, 0.923655556, 0.923655556, 0.923451995, 0.923451995, 0.923247945,
				0.923043841, 0.922839309, 0.922634734, 0.922430133, 0.922430133, 0.9222253, 0.922020201, 0.921815078,
				0.921609733, 0.921609733, 0.921609733, 0.921404112, 0.921404112, 0.921404112, 0.921404112, 0.921404112,
				0.921198024, 0.920991787, 0.920785378, 0.920785378, 0.920785378, 0.920785378, 0.92057815, 0.92057815,
				0.920370451, 0.920370451, 0.920370451, 0.920161653, 0.919952817, 0.919952817, 0.91974376, 0.91974376,
				0.91974376, 0.919533671, 0.919323591, 0.919323591, 0.919323591, 0.919112786, 0.919112786, 0.919112786,
				0.918901745, 0.918690678, 0.918479599, 0.918479599, 0.918479599, 0.918479599, 0.918268031, 0.918268031,
				0.918268031, 0.918056256, 0.917844425, 0.917632194, 0.917419978, 0.917419978, 0.917207312, 0.916994319,
				0.916781278, 0.916781278, 0.916568164, 0.916355077, 0.916355077, 0.916141835, 0.916141835, 0.915928369,
				0.91571478, 0.915500795, 0.915286373, 0.915286373, 0.915286373, 0.915071573, 0.915071573, 0.914856512,
				0.914856512, 0.914856512, 0.914856512, 0.914640701, 0.914640701, 0.914640701, 0.914640701, 0.91442426,
				0.91442426, 0.91442426, 0.914206903, 0.913988811, 0.913769894, 0.913769894, 0.913769894, 0.913769894,
				0.913549464, 0.913549464, 0.913549464, 0.913328395, 0.913107356, 0.913107356, 0.913107356, 0.913107356,
				0.912884334, 0.912884334, 0.912884334, 0.912884334, 0.912660192, 0.912660192, 0.912435468, 0.912435468,
				0.912209995, 0.912209995, 0.911984033, 0.911984033, 0.911984033, 0.911984033 ];
		var J = [ 1, 0.999877382, 0.999754739, 0.999754739, 0.999754739, 0.999631956, 0.999631956, 0.999509067,
				0.99938608, 0.99938608, 0.999263007, 0.999263007, 0.999139889, 0.999016678, 0.999016678, 0.999016678,
				0.999016678, 0.999016678, 0.998892976, 0.998769284, 0.998769284, 0.998645434, 0.998645434, 0.998645434,
				0.998521446, 0.998397292, 0.998397292, 0.998397292, 0.998397292, 0.998272945, 0.998272945, 0.998148506,
				0.998148506, 0.998023965, 0.997899177, 0.997774398, 0.997774398, 0.997774398, 0.997774398, 0.99764933,
				0.99764933, 0.99764933, 0.99764933, 0.99764933, 0.99764933, 0.99764933, 0.99764933, 0.99764933,
				0.997523173, 0.997397002, 0.997397002, 0.997397002, 0.997397002, 0.997270314, 0.997143622, 0.997143622,
				0.997143622, 0.997143622, 0.997143622, 0.997143622, 0.997143622, 0.997143622, 0.997143622, 0.997143622,
				0.997143622, 0.997143622, 0.997143622, 0.997143622, 0.997015748, 0.997015748, 0.997015748, 0.997015748,
				0.997015748, 0.996887678, 0.996887678, 0.996759541, 0.996759541, 0.996631054, 0.996502453, 0.996373864,
				0.996373864, 0.996373864, 0.996373864, 0.996373864, 0.996245106, 0.996116316, 0.996116316, 0.996116316,
				0.996116316, 0.996116316, 0.996116316, 0.99598684, 0.995857361, 0.995727824, 0.995598176, 0.995598176,
				0.995598176, 0.995598176, 0.995598176, 0.995598176, 0.995598176, 0.995468184, 0.995468184, 0.9953379,
				0.995207583, 0.995207583, 0.99507714, 0.99507714, 0.99507714, 0.99507714, 0.994946543, 0.994946543,
				0.994946543, 0.994946543, 0.994946543, 0.994946543, 0.994946543, 0.994946543, 0.994946543, 0.994946543,
				0.994946543, 0.994815158, 0.994815158, 0.994683628, 0.994683628, 0.994683628, 0.994683628, 0.994551531,
				0.994551531, 0.994551531, 0.994419352, 0.994419352, 0.994419352, 0.994286789, 0.994286789, 0.994286789,
				0.99415392, 0.99415392, 0.99415392, 0.99402086, 0.99402086, 0.99402086, 0.993887623, 0.993887623,
				0.993887623, 0.993887623, 0.993887623, 0.993887623, 0.993887623, 0.993753886, 0.993753886, 0.993753886,
				0.993619609, 0.993619609, 0.993619609, 0.993485252, 0.993485252, 0.993485252, 0.993485252, 0.993350708,
				0.993350708, 0.993216101, 0.993081328, 0.993081328, 0.993081328, 0.993081328, 0.992946353, 0.992810951,
				0.992810951, 0.992810951, 0.992675218, 0.992675218, 0.99253922, 0.99253922, 0.99253922, 0.99253922,
				0.99253922, 0.992402998, 0.992402998, 0.992266653, 0.992130259, 0.992130259, 0.992130259, 0.991993578,
				0.991993578, 0.991856717, 0.991856717, 0.991856717, 0.991856717, 0.991719469, 0.991719469, 0.991719469,
				0.991719469, 0.991581685, 0.991443628, 0.991443628, 0.991443628, 0.99130538, 0.991167072, 0.991167072,
				0.991028617, 0.990890175, 0.990890175, 0.990751558, 0.990751558, 0.990751558, 0.990751558, 0.990751558,
				0.990751558, 0.990612634, 0.990612634, 0.990473621, 0.990334594, 0.990334594, 0.99019546, 0.990056335,
				0.990056335, 0.989917027, 0.989917027, 0.989917027, 0.989917027, 0.989917027, 0.989917027, 0.989917027,
				0.989777426, 0.989777426, 0.989777426, 0.989777426, 0.989637645, 0.989637645, 0.989497767, 0.989497767,
				0.989497767, 0.98935767, 0.989217478, 0.989217478, 0.989077219, 0.989077219, 0.989077219, 0.989077219,
				0.989077219, 0.989077219, 0.988936513, 0.988936513, 0.988936513, 0.988795593, 0.988795593, 0.988654524,
				0.988513437, 0.988513437, 0.988372073, 0.988372073, 0.988230595, 0.988230595, 0.988088949, 0.988088949,
				0.987946788, 0.987804572, 0.987804572, 0.987662108, 0.987662108, 0.987662108, 0.987662108, 0.987519331,
				0.987376548, 0.987376548, 0.98723357, 0.98723357, 0.98723357, 0.98723357, 0.987090265, 0.987090265,
				0.987090265, 0.986946733, 0.986803123, 0.986659486, 0.986659486, 0.986515672, 0.986371859, 0.986227962,
				0.986227962, 0.986227962, 0.986227962, 0.986227962, 0.986227962, 0.986083685, 0.986083685, 0.985939256,
				0.985939256, 0.985794627, 0.985794627, 0.985794627, 0.985649735, 0.985649735, 0.985504739, 0.985359714,
				0.985359714, 0.985214547, 0.985069356, 0.985069356, 0.985069356, 0.984923573, 0.984777568, 0.984777568,
				0.984777568, 0.984777568, 0.984777568, 0.984777568, 0.984631211, 0.984484816, 0.984484816, 0.984484816,
				0.984338114, 0.984338114, 0.984338114, 0.984191176, 0.984191176, 0.984044012, 0.983896794, 0.983749534,
				0.983749534, 0.983749534, 0.983749534, 0.983749534, 0.983749534, 0.983601556, 0.983453568, 0.983453568,
				0.983453568, 0.983453568, 0.983305154, 0.983305154, 0.983156628, 0.983156628, 0.983007969, 0.983007969,
				0.983007969, 0.9828592, 0.982710425, 0.982710425, 0.982561567, 0.982561567, 0.982561567, 0.982561567,
				0.982412558, 0.982412558, 0.982412558, 0.982263268, 0.982263268, 0.982113763, 0.982113763, 0.982113763,
				0.982113763, 0.982113763, 0.982113763, 0.982113763, 0.981963534, 0.981963534, 0.981963534, 0.981963534,
				0.981963534, 0.981812906, 0.981812906, 0.981812906, 0.981812906, 0.981661945, 0.981661945, 0.981661945,
				0.981661945, 0.981661945, 0.981661945, 0.981510211, 0.981358378, 0.981206513, 0.981206513, 0.981206513,
				0.981054375, 0.981054375, 0.980901912, 0.980901912, 0.980901912, 0.980749267, 0.980749267, 0.980596438,
				0.980596438, 0.980596438, 0.980443422, 0.980290408, 0.980290408, 0.980290408, 0.980137157, 0.980137157,
				0.979983794, 0.979983794, 0.979983794, 0.979830163, 0.979830163, 0.979830163, 0.979830163, 0.979830163,
				0.979830163, 0.979675974, 0.979675974, 0.979675974, 0.979521382, 0.979366801, 0.979212225, 0.979212225,
				0.979212225, 0.979057491, 0.979057491, 0.979057491, 0.979057491, 0.979057491, 0.978902557, 0.978747593,
				0.978592559, 0.978437479, 0.978437479, 0.978282209, 0.978126898, 0.977971592, 0.977816211, 0.977816211,
				0.977660465, 0.977504635, 0.977504635, 0.977348616, 0.977348616, 0.977192543, 0.977036362, 0.977036362,
				0.977036362, 0.977036362, 0.976880014, 0.976723667, 0.976723667, 0.976567075, 0.976567075, 0.976567075,
				0.976567075, 0.976567075, 0.976410029, 0.976410029, 0.97625267, 0.97625267, 0.97625267, 0.976095106,
				0.976095106, 0.976095106, 0.976095106, 0.975937294, 0.975779279, 0.975621258, 0.975621258, 0.975462583,
				0.975303689, 0.975144647, 0.97498534, 0.97498534, 0.974825835, 0.974666276, 0.974506489, 0.974346698,
				0.974346698, 0.974346698, 0.974346698, 0.974186335, 0.974186335, 0.974186335, 0.974025828, 0.974025828,
				0.974025828, 0.974025828, 0.973865137, 0.973865137, 0.973865137, 0.973865137, 0.973865137, 0.973865137,
				0.973703708, 0.973703708, 0.973703708, 0.973703708, 0.973703708, 0.973541461, 0.973541461, 0.973541461,
				0.973378704, 0.973378704, 0.973215827, 0.973215827, 0.973215827, 0.973215827, 0.973215827, 0.973215827,
				0.973052417, 0.972888992, 0.972888992, 0.972725547, 0.972725547, 0.972725547, 0.972725547, 0.972561904,
				0.972398144, 0.972234166, 0.972070187, 0.971906061, 0.971741794, 0.971741794, 0.971741794, 0.971741794,
				0.971576918, 0.971411807, 0.971246446, 0.971081015, 0.971081015, 0.971081015, 0.970915378, 0.970749651,
				0.970583889, 0.970418117, 0.970252289, 0.970086211, 0.969920146, 0.969920146, 0.969753575, 0.969753575,
				0.969586402, 0.969586402, 0.969586402, 0.969586402, 0.969586402, 0.969418925, 0.969251466, 0.96908398,
				0.96908398, 0.96908398, 0.968916318, 0.968916318, 0.968748598, 0.968580879, 0.968413051, 0.968245215,
				0.968245215, 0.968077237, 0.967909132, 0.967909132, 0.967909132, 0.967740501, 0.96757177, 0.967403013,
				0.96723424, 0.96723424, 0.967065309, 0.966896385, 0.966896385, 0.966727349, 0.966558318, 0.966558318,
				0.966389029, 0.966389029, 0.966219573, 0.966049999, 0.966049999, 0.96588038, 0.96588038, 0.96588038,
				0.965710661, 0.965540946, 0.965540946, 0.965540946, 0.965370754, 0.965370754, 0.965370754, 0.965370754,
				0.965370754, 0.965370754, 0.965370754, 0.965370754, 0.965199788, 0.965199788, 0.965028705, 0.964857288,
				0.964685837, 0.964514162, 0.964342507, 0.964342507, 0.964342507, 0.964342507, 0.964169532, 0.963996544,
				0.96382358, 0.96382358, 0.96382358, 0.963650469, 0.963477362, 0.963304235, 0.963304235, 0.963131096,
				0.963131096, 0.962957838, 0.962957838, 0.962784322, 0.962784322, 0.962784322, 0.962784322, 0.962610474,
				0.962610474, 0.96243628, 0.962262095, 0.962262095, 0.962262095, 0.962262095, 0.962087752, 0.962087752,
				0.962087752, 0.961912721, 0.961737614, 0.961562525, 0.961562525, 0.961562525, 0.961387132, 0.961387132,
				0.961211588, 0.961211588, 0.961035986, 0.961035986, 0.961035986, 0.961035986, 0.961035986, 0.960860048,
				0.960860048, 0.960860048, 0.960860048, 0.960683955, 0.960507609, 0.960507609, 0.960331134, 0.960154597,
				0.960154597, 0.960154597, 0.960154597, 0.960154597, 0.960154597, 0.959976939, 0.959798958, 0.95962098,
				0.95962098, 0.959442987, 0.959265012, 0.959265012, 0.959265012, 0.959265012, 0.95908663, 0.95908663,
				0.958908204, 0.958729788, 0.958729788, 0.958551221, 0.958372634, 0.958194074, 0.958194074, 0.958014995,
				0.958014995, 0.958014995, 0.957835556, 0.957656061, 0.957656061, 0.957476321, 0.957296561, 0.957296561,
				0.957296561, 0.957116684, 0.957116684, 0.957116684, 0.956936671, 0.956756454, 0.956756454, 0.956756454,
				0.956756454, 0.956575933, 0.956395352, 0.956395352, 0.956395352, 0.956395352, 0.956395352, 0.956214378,
				0.956033372, 0.956033372, 0.956033372, 0.955852143, 0.955852143, 0.955852143, 0.955852143, 0.955852143,
				0.955670521, 0.95548884, 0.95548884, 0.955306878, 0.955306878, 0.955124624, 0.955124624, 0.954942189,
				0.954942189, 0.954942189, 0.954759442, 0.954576498, 0.954393375, 0.954210241, 0.954027083, 0.954027083,
				0.954027083, 0.953843392, 0.953843392, 0.95365961, 0.95365961, 0.95365961, 0.953475582, 0.953475582,
				0.953291402, 0.953291402, 0.953291402, 0.953107108, 0.953107108, 0.952922627, 0.95273809, 0.952553257,
				0.952553257, 0.95236829, 0.952183133, 0.952183133, 0.952183133, 0.952183133, 0.952183133, 0.951997371,
				0.951997371, 0.95181148, 0.95181148, 0.95181148, 0.95181148, 0.95181148, 0.951625255, 0.951625255,
				0.951438479, 0.951438479, 0.951438479, 0.951251384, 0.951064294, 0.950877059, 0.950689809, 0.950502513,
				0.950502513, 0.950502513, 0.950502513, 0.950315017, 0.950315017, 0.95012732, 0.949939632, 0.949939632,
				0.949939632, 0.949751294, 0.949562853, 0.949374442, 0.949185944, 0.948997391, 0.948808754, 0.94862012,
				0.94862012, 0.948431419, 0.948242743, 0.948242743, 0.94805392, 0.94805392, 0.947864987, 0.947864987,
				0.947675913, 0.947486792, 0.947297683, 0.947297683, 0.94710855, 0.946919204, 0.946919204, 0.946919204,
				0.946729641, 0.946729641, 0.946729641, 0.946539953, 0.946350168, 0.946350168, 0.946350168, 0.946160021,
				0.946160021, 0.946160021, 0.946160021, 0.945969465, 0.945778759, 0.945778759, 0.945587939, 0.945587939,
				0.945587939, 0.945396871, 0.945205732, 0.945014497, 0.944823154, 0.944823154, 0.944631459, 0.944439698,
				0.944439698, 0.944247844, 0.944247844, 0.944055481, 0.943862999, 0.943670474, 0.943477804, 0.943477804,
				0.943284979, 0.943091861, 0.943091861, 0.943091861, 0.943091861, 0.942898217, 0.942704577, 0.942510846,
				0.942317027, 0.942317027, 0.942123019, 0.941928618, 0.941734111, 0.941734111, 0.941539389, 0.941539389,
				0.941344551, 0.941344551, 0.941149721, 0.941149721, 0.940954792, 0.940954792, 0.940759559, 0.940564088,
				0.940368394, 0.940368394, 0.940172666, 0.940172666, 0.940172666, 0.939976366, 0.939976366, 0.939779891,
				0.939779891, 0.939779891, 0.939582687, 0.939582687, 0.939582687, 0.939582687, 0.939582687, 0.939385094,
				0.93918724, 0.938989178, 0.938989178, 0.938989178, 0.938790267, 0.938790267, 0.938790267, 0.938790267,
				0.938790267, 0.938591055, 0.938391847, 0.938192381, 0.937992887, 0.937992887, 0.937992887, 0.937792671,
				0.937592469, 0.937592469, 0.937391872, 0.937190866, 0.937190866, 0.937190866, 0.936989394, 0.936787951,
				0.936586519, 0.936586519, 0.936586519, 0.936384794, 0.936183086, 0.935981283, 0.935981283, 0.935981283,
				0.935778797, 0.935576325, 0.935576325, 0.935373377, 0.935170257, 0.934966628, 0.934763006, 0.934559289,
				0.934559289, 0.934559289, 0.934355411, 0.9341515, 0.9341515, 0.9341515, 0.933946876, 0.933742151,
				0.933537132, 0.933537132, 0.933537132, 0.933332005, 0.933126886, 0.932921661, 0.932716458, 0.932510877,
				0.932305259, 0.932099345, 0.931893349, 0.93168738, 0.931481433, 0.931275275, 0.931275275, 0.931069075,
				0.93086282, 0.930656475, 0.930656475, 0.930449999, 0.930449999, 0.930449999, 0.930243312, 0.930036489,
				0.929829454, 0.929829454, 0.929622208, 0.929414947, 0.92920753, 0.92920753, 0.92920753, 0.92920753,
				0.928999257, 0.928999257, 0.928999257, 0.928790842, 0.928790842, 0.928582023, 0.928582023, 0.928582023,
				0.928582023, 0.928582023, 0.928582023, 0.928372046, 0.928372046, 0.928372046, 0.928372046, 0.928372046,
				0.928161369, 0.927950597, 0.927950597, 0.927739748, 0.927528894, 0.927317861, 0.927106619, 0.927106619,
				0.927106619, 0.927106619, 0.92689458, 0.92668228, 0.926469948, 0.926469948, 0.926257284, 0.926257284,
				0.926044011, 0.925830261, 0.925830261, 0.925830261, 0.925616177, 0.925616177, 0.925401464, 0.925186617,
				0.925186617, 0.925186617, 0.92497113, 0.924755558, 0.924755558, 0.924539611, 0.924323638, 0.924323638,
				0.924323638, 0.924323638, 0.924107424, 0.92389122, 0.923674944, 0.923674944, 0.923458501, 0.923241927,
				0.923241927, 0.923241927, 0.923241927, 0.923241927, 0.923024828, 0.923024828, 0.923024828, 0.923024828,
				0.922807067, 0.922807067, 0.922807067, 0.92258914, 0.92258914, 0.922370894, 0.922370894, 0.922370894,
				0.922370894, 0.922370894, 0.922151617, 0.921932103, 0.921932103, 0.921712341, 0.921712341, 0.921492116,
				0.921271713, 0.921051159, 0.921051159, 0.920830407, 0.920609706, 0.92038869, 0.92038869, 0.920167213,
				0.919945043, 0.919945043, 0.919945043, 0.919945043, 0.919720658, 0.919495992, 0.919271144, 0.919271144,
				0.919045503, 0.918819742, 0.918819742, 0.918819742, 0.918593651, 0.918367207, 0.918140177, 0.918140177,
				0.917912454, 0.917683706, 0.917454902, 0.917454902, 0.917225642, 0.917225642, 0.916995765, 0.916995765,
				0.916765558, 0.916765558, 0.91653476, 0.916303773, 0.916072612 ];
		var F = new Array(1500);
		var G = new Array(1500);
		var K = new Array(1500);
		var M = new Array(1500);
		var Q2 = (isMale) ? 1 : 0;
		var Q3 = Math.log(age);
		var Q4 = Math.log(systolicBp);
		var Q5 = (smoker) ? 1 : 0;
		var Q6 = (treatedBp) ? 1 : 0;
		var Q7 = Math.log(BMI);
		var Q8 = (diabetic) ? 1 : 0;
		var R2 = 0.73413;
		var R3 = 3.07187;
		var R4 = 1.79939;
		var R5 = 0.79437;
		var R6 = 0.3926;
		var R7 = 1.1166;
		var R8 = 1.03634;
		var S2 = Q2 * R2;
		var S3 = Q3 * R3;
		var S4 = Q4 * R4;
		var S5 = Q5 * R5;
		var S6 = Q6 * R6;
		var S7 = Q7 * R7;
		var S8 = Q8 * R8;
		var S10 = S2 + S3 + S4 + S5 + S6 + S7 + S8;
		var T2 = 0.47275;
		var T3 = 3.55871;
		var T4 = 1.5204;
		var T5 = 0.96516;
		var T6 = 0.11331;
		var T7 = -0.27572;
		var T8 = 0.45868;
		var U2 = Q2 * T2;
		var U3 = Q3 * T3;
		var U4 = Q4 * T4;
		var U5 = Q5 * T5;
		var U6 = Q6 * T6;
		var U7 = Q7 * T7;
		var U8 = Q8 * T8;
		var U10 = U2 + U3 + U4 + U5 + U6 + U7 + U8;
		var W2 = 23.93525811;
		var X2 = 19.79731622;
		var W5 = Math.exp(S10 - W2);
		var X5 = Math.exp(U10 - X2);
		// set F
		for ( i = 0; i < E.length && i < F.length; i++) {
			F[i] = Math.pow(E[i], W5);
		}
		// set G
		for ( i = 0; i + 1 < E.length; i++) {
			G[i] = Math.log(E[i]) - Math.log(E[i + 1]);
		}
		// set K
		for ( i = 0; i < K.length && i < J.length; i++) {
			K[i] = Math.pow(J[i], X5);
		}
		// set M
		M[0] = W5 * (-Math.log(E[0]));
		for ( i = 0; i + 1 < M.length && i < F.length && i < K.length && i < G.length; i++) {
			M[i + 1] = F[i] * K[i] * W5 * G[i];
		}
		// now we can calculate the risk values
		var hardRisk = 0;
		for ( i = 0; i < M.length && !isNaN(M[i]); i++) {
			hardRisk = hardRisk + M[i];
		}
		return Math.round(100*hardRisk);
	}






  function changeColor() {
														jQuery('input[name="fram_calc_syst_bp"]').css('color', 'grey');
														jQuery('input[name="fram_calc_age"]').css('color', 'grey');
														jQuery('input[name="fram_calc_race"]').css('color', 'grey');
														jQuery('input[name="fram_calc_total_cholesterol"]').css('color', 'grey');
														jQuery('input[name="fram_calc_hdl"]').css('color', 'grey');
													}
													jQuery(document).keypress(function(e) {
														if(e.which == 13) {
															MayoExpertFraminghamCalculator.displayRisk();
														}
													});
													var MayoExpertFraminghamCalculator = new function() {
														/**
														 *  To ajust the cutpoints for high/intermediate/low risk, change these  
														 *  values. The range between high and low is considered "intermediate".
														 */
													
														this.getFormData = function(){
															var fram_data = {
																"sex"			: null,
																"race"          : null,
																"systolic_bp" 	: null,
																"age"			: null,
																"diabetes"		: null,
																"smoker"		: null,
																"hyp_treated"	: null,
																"cholesterol"	: null,
																"hdl"			: null
															};
															fram_data.sex 			= jQuery('input[name="fram_calc_sex"]:checked').val();
															fram_data.race 			= jQuery('select[name="fram_calc_race"] :selected').val();
															fram_data.systolic_bp 	= jQuery('input[name="fram_calc_syst_bp"]').val();
															fram_data.age 			= jQuery('input[name="fram_calc_age"]').val();
															fram_data.diabetes 		= jQuery('input[name="fram_calc_diabetes"]:checked').val();
															fram_data.smoker 		= jQuery('input[name="fram_calc_smoker"]:checked').val();
															fram_data.hyp_treated 	= jQuery('input[name="fram_calc_hypertension"]:checked').val();
															fram_data.cholesterol 	= jQuery('input[name="fram_calc_total_cholesterol"]').val();
															fram_data.hdl 			= jQuery('input[name="fram_calc_hdl"]').val();
															// sanitize values in case we have the placeholder text (this can happen in IE8/9)
															if(fram_data.systolic_bp == '90-200')
																fram_data.systolic_bp = null;
															if(fram_data.age == '20-79')
																fram_data.age = null;
															if(fram_data.cholesterol == '100-405')
																fram_data.cholesterol = null;
															if(fram_data.hdl == '10-100')
																fram_data.hdl = null;
															return fram_data;
														};
														
														this.displayRisk = function(){
															var riskObj = this.getRisk();
															
															if(riskObj.poolcohort10Pct != null && riskObj.fram30Pct == null){
															jQuery('#pooled_cohort_10_year_risk').html(riskObj.poolcohort10Pct+'%');
															jQuery('#hidden_framingham').hide();
															jQuery('#fram30yr_risk_display').hide();
															jQuery('#pooledcohort10yr_risk_display').hide();
															jQuery('#fram_risk_display').hide();
															jQuery('#hidden_pooledcohort').show();
															jQuery('#fram_risk_10_val').html(riskObj.poolcohort10Pct+'%');
															jQuery('#pooledcohort10yr_risk_display').slideUp( 300 ).delay(1000).show();
															jQuery('#fram_risk_display').show();

															
															}
															if(riskObj.poolcohort10Pct == null && riskObj.fram30Pct != null){
															jQuery('#pooledcohort10yr_risk_display').hide();
															jQuery('#hidden_pooledcohort').hide();
														    jQuery('#hidden_framingham').hide();
															jQuery('#fram_risk_display').hide();
															jQuery('#fram30yr_risk_display').hide();
															jQuery('#fram_risk_30_val').html(riskObj.fram30Pct+'%');
															jQuery('#framingham_30_year_risk').html(riskObj.fram30Pct+'%');
															jQuery('#hidden_framingham').show();
															jQuery('#fram30yr_risk_display').slideUp( 300 ).delay(1000).show();
															jQuery('#fram_risk_display').show();
															
															}
															if(riskObj.poolcohort10Pct != null && riskObj.fram30Pct != null){
															jQuery('#pooledcohort10yr_risk_display').hide();
															jQuery('#hidden_pooledcohort').hide();
														    jQuery('#hidden_framingham').hide();
															jQuery('#fram_risk_display').hide();
															jQuery('#fram30yr_risk_display').hide();
															if(riskObj.poolcohort10Pct != null && riskObj.poolcohort10Pct.indexOf('Invalid') >= 0)
															{
															jQuery('#fram_risk_10_val').html(riskObj.poolcohort10Pct);
															jQuery('#pooled_cohort_10_year_risk').html(riskObj.poolcohort10Pct);
															}else{
															jQuery('#fram_risk_10_val').html(riskObj.poolcohort10Pct+'%');
															jQuery('#pooled_cohort_10_year_risk').html(riskObj.poolcohort10Pct+'%');
															}
															jQuery('#fram_risk_30_val').html(riskObj.fram30Pct+'%');
															jQuery('#framingham_30_year_risk').html(riskObj.fram30Pct+'%');
															jQuery('#fram_risk_display').show();
															jQuery('#pooledcohort10yr_risk_display').show();
															jQuery('#fram30yr_risk_display').show();
															jQuery('#hidden_pooledcohort').show();
															jQuery('#hidden_framingham').show();
															}
														
																
															return;
														};
														
														/**
														 * Returns a JSON object of the following form:
														 * { "errorMsg"  : null,   <--- An error message string, or null if no errors
														 *   "risk"      : null,   <--- A string with the risk level of "high", "intermediate" or "low"
														 *   "riskPct"   : null,   <--- The risk percent from either the 30 or 10 year, based on which one drove the overall risk level
														 *   "attainPct" : null,   <--- the attainable risk, if the patient were to get all risk factors in check
														 *   "fram30Pct" : null,   <--- The 30 year risk value, or null if none was computed
														 *   "fram10Pct" : null    <--- The 10 year risk value, or null if none was computed
														 * };
														 */
														this.getRisk = function(){
															// year risk determination
															var riskResults = {
																	"errorMsg"	: null,
																	"risk"		: null,
																	"riskPct"	: null,
																	"attainRisk": null,
																	"attainPct" : null,
																	"fram30Pct"	: null,
																	"fram30AttainRisk": null,
																	"fram10Pct" : null,
																	"fram10AttainRisk": null
																};
															riskResults.errorMsg = this.validateForm();
															// if we get an error message back it means we should go no further, bail out!
															if(riskResults.errorMsg != null)
																return riskResults;
															var fram_data = this.getFormData();
															
															/*
															 * BUSINESS LOGIC FOR DETERMINING WHICH CALCULATOR TO RUN
															 * (Specified by Dr. Francisco Lopez)
															 *    - Males/Females ages 20-59 use 30-year risk calculation
															 *    - Females aged 50 years and older use 10-year risk calculation
															 *    - Males aged 40 years and older use 10-year risk calculation
															 *    - Maximum age for 10-year is 79 years old
															 *    - Maximum age for 30-year is 60 years old
															 *    - Males/Females may use both calculations when appropriate, 
															 *      and in this case use the higher relative risk
															 
															 var fram_data = {
																"sex"			: null,
																"race"          : null,
																"systolic_bp" 	: null,
																"age"			: null,
																"diabetes"		: null,
																"smoker"		: null,
																"hyp_treated"	: null,
																"cholesterol"	: null,
																"hdl"			: null
															};*/
															var use10 = ((fram_data.sex == 'F' && fram_data.age >= 50) ||
															             (fram_data.sex == 'M' && fram_data.age >= 40)) &&
																		(fram_data.age < 80) && (fram_data.age >= 30);
															var use30 = (fram_data.age < 60) && (fram_data.age >= 20);
															var pooledCohortRisk = null;
															var framingham30Risk = null;
															if(use10) {
															pooledCohortRisk = PooledCohortAha10YearRisk.getRisk(
																fram_data.age, fram_data.sex, fram_data.race, fram_data.systolic_bp, fram_data.cholesterol, fram_data.hdl, 
																(fram_data.smoker == 'Y'), 
																(fram_data.hyp_treated == 'TREATED'), 
																(fram_data.diabetes == 'Y'));
																if ((fram_data.sex == 'F' && fram_data.age >= 50) && (fram_data.cholesterol >320) ||
															        (fram_data.sex == 'M' && fram_data.age >= 40) && (fram_data.cholesterol >320))
																 {
																	riskResults.poolcohort10Pct = pooledCohortRisk.errorString;
																 }
																 else if (fram_data.hdl <20)			
																 {
																	riskResults.poolcohort10Pct = pooledCohortRisk.errorString;
																 }
																 else{
																	riskResults.poolcohort10Pct = ''+pooledCohortRisk.patientRisk;
																 }
															}
															if(use30) {
															framingham30Risk = calculateHardRiskNoBmi(
																		fram_data.age, 
																		(fram_data.sex == 'M'), 
																		fram_data.systolic_bp, 
																		fram_data.cholesterol, 
																		fram_data.hdl, 
																		(fram_data.smoker == 'Y'), 
																		(fram_data.hyp_treated == 'TREATED'), 
																		(fram_data.diabetes == 'Y'));
																		
																		riskResults.fram30Pct = framingham30Risk.risk;
																		
															}
															

															return riskResults;
														};
														
														/**
														 *  validateForm
														 *    - Return null if all data is valid, appropriate error string if not.
														 */
														this.validateForm = function(){
															var rtnVal = null;
															var fram_data = this.getFormData();
															if(fram_data.hdl == undefined || fram_data.hdl == '' || fram_data.hdl > 100 || fram_data.hdl < 10) {
															//	rtnVal = "Please enter an HDL value (valid range: 10-100 mg/dL)";
																rtnVal = "Error";
																$('#fram_calc_hdl_tr').addClass('text-input-error');
																$('#fram_calc_hdl_error_text').show();
															}
															if(fram_data.cholesterol == undefined || fram_data.cholesterol == '' || fram_data.cholesterol < 100 || fram_data.cholesterol > 405) {
															//	rtnVal = "Please enter a cholesterol value (valid range: 100-405 mg/dL)";
																rtnVal = "Error";																
																$('#fram_calc_total_cholesterol_tr').addClass('text-input-error');
																$('#fram_calc_total_cholesterol_error_text').show();
															}
															if(fram_data.hyp_treated == undefined || fram_data.hyp_treated == '') {
															//	rtnVal = "Please select none, treated or untreated for hypertension treated";
																rtnVal = "Error";															
																$('#fram_calc_hypertension_tr').addClass('text-input-error');
																$('#fram_calc_hypertension_error_text').show();
															}
															if(fram_data.smoker == undefined || fram_data.smoker == '') {
															//	rtnVal = "Please select yes or no for smoker";
																rtnVal = "Error";												
																$('#fram_calc_smoker_tr').addClass('text-input-error');
																$('#fram_calc_smoker_error_text').show();
															}
															if(fram_data.diabetes == undefined || fram_data.diabetes == '') {
															//	rtnVal = "Please select yes or no for diabetes";
																rtnVal = "Error";																
																$('#fram_calc_diabetes_tr').addClass('text-input-error');
																$('#fram_calc_diabetes_error_text').show();
															}
															if(fram_data.age == undefined || fram_data.age == '' || fram_data.age < 20 || fram_data.age > 79) {
															//	rtnVal = "Please enter an age (valid range: 20-79 years)";
																rtnVal = "Error";															
																$('#fram_calc_age_tr').addClass('text-input-error');
																$('#fram_calc_age_error_text').show();
															}
															if(fram_data.systolic_bp == undefined || fram_data.systolic_bp == '' || fram_data.systolic_bp < 90 || fram_data.systolic_bp > 200) {
															//	rtnVal = "Please enter a systolic blood pressure (valid range: 90-200 mmHg)";
																rtnVal = "Error";																
																$('#fram_calc_syst_bp_tr').addClass('text-input-error');
																$('#fram_calc_syst_bp_error_text').show();
															}
															if(fram_data.sex == undefined || fram_data.sex == '') {
															//	rtnVal = "Please select male or female";
																rtnVal = "Error";																
																$('#fram_calc_sex_tr').addClass('text-input-error');
																$('#fram_calc_sex_error_text').show();
															}
															if(fram_data.race == undefined || fram_data.race == '') {
															//	rtnVal = "Please select race";
																rtnVal = "Error";																
																$('#fram_calc_race_tr').addClass('text-input-error');
																$('#fram_calc_race_error_text').show();
															}															
															return rtnVal;
														};
													};