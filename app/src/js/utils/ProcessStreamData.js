export function processStreamData(existingStockData, msg) {

	const streamData = typeof msg === "string" ? JSON.parse(msg) : msg;

	const updatedStateData = Object.keys(existingStockData).length ? existingStockData : {};

	//creating structure for the data to support hisorical chart and last update
	streamData.map(item => {
		if (updatedStateData.hasOwnProperty(item[0])) {
			updatedStateData[item[0]]['price'].push(item[1]);
			updatedStateData[item[0]]['updated_at'].push(new Date());
		} else {
			updatedStateData[item[0]] = {'name': item[0], 'price': [item[1]], 'updated_at': [new Date()]}
		}
		updatedStateData[item[0]]['price'] = updatedStateData[item[0]]['price'].slice(0, 20).reverse();
		updatedStateData[item[0]]['updated_at'] = updatedStateData[item[0]]['updated_at'].slice(0, 20).reverse();
		return updatedStateData;
	});
	
	console.log(updatedStateData);
	return updatedStateData;

}