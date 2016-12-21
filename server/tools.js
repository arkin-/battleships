
var findBy = global.findBy = (key, array, value) => {
    return (array || []).find((item) => {
        if (item[key] === value) {
            return item;
        }
    });
};

var findById = global.findById = (array, id) => {
    return findBy('id', array, id);
};
