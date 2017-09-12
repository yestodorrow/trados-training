
		
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
															// hide error messages
															$('.error-global').hide();
															$('.error-message').hide();

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
																
																	riskResults.poolcohort10Pct = ''+pooledCohortRisk.patientRisk;
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
															if (rtnVal === "Error") {
																$('.error-global').show();
																$('.error-global')[0].scrollIntoView();
															}
															return rtnVal;
														};
													};
												
