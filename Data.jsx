var editor = new DataTable.Editor( {
    ajax: "php/users.php",
    table: "#users",
    fields: [
        { label: "First name:", name: "first_name" },
        { label: "Last name:",  name: "last_name" },
        { label: "Approved:",   name: "approved" }
    ]
} );
 
var table = new DataTable('#users', {
    dom: "Bfrtip",
    ajax: "php/users.php",
    columns: [
        { data: "first_name" },
        { data: "last_name" },
        { data: "approved" }
    ],
    select: true,
    buttons: [
        { extend: "create", editor: editor },
        { extend: "edit",   editor: editor },
        { extend: "remove", editor: editor }
    ]
} );
 
$('#users').on( 'click', 'tbody td', function () {
    editor.inline( this );
} );
 
$('#approve').on( 'click', function () {
    editor
        .edit( table.rows( {selected: true } ).indexes(), false )
        .val( 'approved', 1 )
        .submit();
} );
