$(document).ready(function() { 
	/* Don't change error messages for validation on "change" event

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
	*/

	// hide global error message by default
	$('.error-global').hide();
	
	$('.fram_risk_reset').click(function() {
		
		$('.error-global').hide();
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
