

export const HeaderValues = [
	{Header: 'Name', accessor: 'name'}, 
	{Header: 'Temperature State', accessor: 'temp'}, 
	{Header: 'Packaging', accessor: 'pkg'}, 
	{Header: 'Quantity (lbs)', accessor: 'qty'}, 
	{Header: 'Five', accessor: 'five'}
];

export function convertToFrontend(ingredient, ingredientsList) {
	return {
			name: ingredient.name, 
			temp: ingredient.temperatureState, 
			pkg: ingredient.package, 
			qty: ingredient.package, 
			five: "oh hi mark",
	}
}