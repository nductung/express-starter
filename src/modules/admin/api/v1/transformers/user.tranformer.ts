import InterfaceModelUser from "../../../../../interfaces/user.interface";

const userTransformer = (items: InterfaceModelUser[] | InterfaceModelUser) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item))
    }
    return singleItem(items);
};

const singleItem = (item: InterfaceModelUser) => {
    const data = {
        email: item.email,
        username: item.username,
        firstName: item.firstName,
        lastName: item.lastName,
        fullName: item.fullName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
    if (data) {
        return data
    } else {
        return item
    }
};

export default userTransformer;
