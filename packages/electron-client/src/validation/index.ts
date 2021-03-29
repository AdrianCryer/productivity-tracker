import { Activity, Category } from "@productivity-tracker/common/lib/schema";

export function validateCategory(category: Category, payload: Partial<Category>, categories: Category[]) {
    let errors: any = {};
    if (payload.name !== undefined) {
        if (payload.name === "") {
            errors.name = "Category Name cannot be empty";
        } else if (categories.findIndex(c => c.name === category.name) > -1) {
            errors.name = "Category with same name already exists";
        }
    }
    return errors;
}

export function validateActivity(activity: Activity, payload: Partial<Activity>) {
    let errors: any = {}
    if (payload.name !== undefined) {
        if (payload.name === "") {
            errors.name = "Activity Name cannot be empty";
        }
    }
    return errors;
}