import firebase from "firebase/app";
import { 
    Activity, 
    Category, 
    Record, 
} from "./client-schema";

/** 
 * Firestore data types: 
 * 
 * Identical except each type excludes the id parameter, and also records are not
 * stored within each activitiy object, but instead at their own level.
 * 
 * The reasoning for this is that by keeping the firestore records collection
 * at a global level, we only have to manage a single listener to manage any 
 * change. Since this program assumes the design philosophy that all user data 
 * should be cached on their system (and updates are preformed based on the delta 
 * in updates between their copy and the cloud), it makes things much easier.
 */
// export type FirestoreCategory = Omit<Category, 'id'>;
// export type FirestoreActivity = Omit<Activity, 'id' | 'records'>;
// export type FirestoreRecord = Omit<Record, 'id'>;


export type OnBatchCategoryChange = (
    updates: {
        category: Category, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export type OnBatchActivitiesChange = (
    updates: {
        activity: Omit<Activity, 'records'>, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export type OnBatchRecordsChange = (
    updates: {
        record: Record, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;