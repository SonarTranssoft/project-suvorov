function displayCurrentUser() {
    let arr = [];
    BX24.callMethod(
        "crm.deal.list",
        {
            order: {"STAGE_ID": "ASC"},
            select: ["ID", "TITLE", "STAGE_ID", "PROBABILITY", "OPPORTUNITY", "CURRENCY_ID", "UF_*"]
        },
        function (result) {
            if (result.error())
                console.error(result.error());
            else {
                result.data().forEach(el => {
                    arr.push(el.UF_CRM_1598808869287);
                })
                if (result.more())
                    result.next();
            }
        }
    );
    return arr;
}
