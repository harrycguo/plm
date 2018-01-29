

export const HeaderValues = [
	{_id: 0, value: 'Name'}, 
	{_id: 1, value: 'Package'}, 
	{_id: 2, value: 'Three'}, 
	{_id: 3, value: 'Four'}, 
	{_id: 4, value: 'Five'}
];

export function convertToFrontend(ingredient, ingredientsList) {
	return {
		_id: ingredientsList.length, 
		value: [
			{_id: 0, value: ingredient.name} , 
			{_id: 1, value: ingredient.package}, 
			{_id: 2, value: ingredient.temperatureState}, 
			{_id: 3, value: ingredient.vendors}, 
			{_id: 4, value: "oh hi mark"},
			{_id: 5, value: ingredient},
			{_id: 6, value: ingredientsList}
		]
	}
}