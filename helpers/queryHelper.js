module.extends = {

    prepareQuery: function (query, params) {
        var fields = params.fields,
            limit = params.limit,
            sort = params.sort,
            pageNum = params.pageNum;

        if (limit) {
            query.limit(parseInt(limit));
        }
        if (pageNum) {
            query.skip(parseInt((pageNum - 1) * limit));
        }
        if (sort) {
            query.sort(sort);
        }
        if (fields) {
            query.select(fields);
        }

    }

};
