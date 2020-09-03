BX24.init(() => {
    // BX24.callMethod(
    //     "crm.deal.list",
    //     {
    //         order: { "STAGE_ID": "ASC"},
    //         filter: { ">PROBABILITY": 50 },
    //         select: [ "ID", "TITLE", "TYPE_ID", "STAGE_ID", "PROBABILITY", "OPPORTUNITY", "CURRENCY_ID", "CONTACT_ID"]
    //     },
    //     function(result) {
    //         if(result.error())
    //             console.error(result.error());
    //         else
    //         {
    //             console.dir(result.data());
    //             if(result.more())
    //                 result.next();
    //         }
    //     }
    // );
    BX24.callMethod(
        "crm.contact.get",
        {id: 2},
        function (result) {
            if (result.error())
                console.error(result.error());
            else
                console.dir(result.data());
        }
    );

    BX24.callMethod(
        "crm.deal.list",
        {
            order: {"STAGE_ID": "ASC"},
            select: ["ID", "TITLE", "TYPE_ID", "STAGE_ID", "PROBABILITY", "OPPORTUNITY", "CURRENCY_ID", "CONTACT_ID", "ASSIGNED_BY_ID", "UF_*"]
        },
        function (result)  {
            if (result.error())
                console.error(result.error());
            else {
                console.dir(result.data());
                if (result.more())
                    result.next();
            }
        }
    );
});