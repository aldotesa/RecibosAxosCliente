class RegisterRequest {
    constructor(Email, Password) {
        this.Email = Email;
        this.Password = Password;
    }
    json() {
        return JSON.stringify({
            Email: this.Email,
            Password: this.Password,
            ConfirmPassword: this.Password
        });
    }
    enviarPeticion() {
        if (!DevExpress.validationEngine.validateGroup('validarLogin').isValid)
            return;
        $.ajax({
            url: '/Account/Register',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8;',
            beforeSend: function (e) {
                $('#btnRegistrar').dxButton('instance').option('text', 'Registrando...');
                $('#btnRegistrar').dxButton('instance').option('icon', 'fas fa-cog fa-spin');
            },
            data: this.json(),
            complete: function (jqXHR, textStatus) {
                console.log(jqXHR);
                if (jqXHR.statusText === 'success') {
                    toastr.success(jqXHR.responseJSON.Mensaje);
                    setTimeout(function () {
                        window.location = '/';
                    }, 1000);
                } else {
                    $('#btnRegistrar').removeAttr('disabled');
                    $('#txtUsuario').prop("disabled", false);
                    $('#txtPassword').prop("disabled", false);
                }
            }
        });
    }
}

$(document).ready(function (e) {
    $('#txtUsername').dxTextBox({
        type: "text",
        placeholder: "Correo electrónico",
        valueChangeEvent: 'keyup'
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "El correo electrónico es requerido"
        }],
        validationGroup: 'validarLogin'
    });
    $('#txtPassword').dxTextBox({
        type: "text",
        mode: 'password',
        placeholder: "Contraseña",
        valueChangeEvent: 'keyup'
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "La contraseña es requerida"
        }],
        validationGroup: 'validarLogin'
    });

    $('#btnRegistrar').dxButton({
        type: "default",
        onClick: function (e) {
            let request = new RegisterRequest(
                $('#txtUsername').dxTextBox('instance').option('value'),
                $('#txtPassword').dxTextBox('instance').option('value'));
            request.enviarPeticion();
        },
        text: "Registrarme",
        width: "230px",
        icon: 'fas fa-user-plus'
    });
});

const enviarPeticion = e => {
    //var peticion new Login();
};
