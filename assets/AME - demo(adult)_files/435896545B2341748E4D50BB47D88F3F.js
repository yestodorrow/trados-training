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
	 * @param age
	 *            age of the patient, in years.
	 * @param isMale
	 *            true if patient is male, false if female
	 * @param systolicBp
	 *            systolic blood pressure
	 * @param cholesterol
	 *            total cholesterol
	 * @param hdl
	 *            high density lipoprotein
	 * @param smoker
	 *            true if patient smokes, false if not
	 * @param treatedBp
	 *            true if patient is taking medications to treat high blood pressure, false if not
	 * @param diabetic
	 *            true if patient is diabetic, false if not
	 * @return 
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
