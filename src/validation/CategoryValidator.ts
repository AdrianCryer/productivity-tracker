import { Category } from "../core";
import { useDataStore } from "../stores/DataStore";


export function useCategoryValidator(category: Category, payload: Partial<Category>, categories: Category[]) {

    let errors: any = {};
    if (payload.name !== undefined) {
        if (payload.name === "") {
            errors.name = "Category Name cannot be empty";
        } else if (categories.findIndex(c => c.name === category.name) > -1) {
            errors.name = "Category with same name already exists";
        }
    }
}