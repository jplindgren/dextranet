function convertToDate(dateString){
	var date = new Date();

	var dateStringArray = dateString.split("-");

	var fullYearArray = setFullYearArray(dateStringArray[0]);
	var hourArray = setHourArray(dateStringArray[1]);

	date = setDate(date,fullYearArray,hourArray);
	console.log(date);

	return date;

}

function setDate(dateObject , fullYearArray , hourArray){

	dateObject.setFullYear(fullYearArray[0],fullYearArray[1]-1,fullYearArray[2]);
	dateObject.setHours(hourArray[0]);
	dateObject.setMinutes(hourArray[1]);
	dateObject.setSeconds(hourArray[2]);
	dateObject.setSeconds(hourArray[2]);
	return dateObject;
}

function setFullYearArray(fullYearString){
	return fullYearString.split("/");
}

function setHourArray(hourString){
	return hourString.split(":");
}

function setWeekDay(weekDay){
	return weekDay;
}