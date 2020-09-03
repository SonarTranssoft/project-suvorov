export default function getContacts(){
    BX24.callMethod(
        "crm.contact.get",
        {id: 2},
        function (result) {
            if (result.error())
                return result.error();
            else
                return result.data();
        }
    );
}