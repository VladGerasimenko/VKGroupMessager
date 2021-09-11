export class Utils {

    public static generateRandomWallPost(length: number): string {
        let post: string = "";
        let possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            post += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return post;
    }

    public static getRandomEntryFromMap<K, V>(usersData: Map<K, V>): Map<K, V>{
        let entry: Map<K, V> = new Map<K, V>()
        let keys: Array<K> = [...usersData.keys()]
        let randomKey: K = keys[Math.floor(Math.random() * keys.length)];
        entry.set(randomKey, <V>usersData.get(randomKey))
        return entry
    }

    public static getRandomValueFromArray<T>(arr: Array<T>): T {
        return arr[Math.floor((Math.random()*this.length))];
    }
}