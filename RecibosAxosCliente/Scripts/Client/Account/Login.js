class LoginRequest {
    constructor(Email, Password) {
        this.Email = Email;
        this.Password = Password;
    }
    json() {
        return JSON.stringify({
            Email: this.Email,
            Password: this.Password
        });
    }
    enviarPeticion() {
        if (!DevExpress.validationEngine.validateGroup('validarLogin').isValid)
            return;
        $.ajax({
            url: '/Account/Login',
            type: 'post',
            contentType: 'application/json; charset=utf-8;',
            dataType:'json',
            beforeSend: function (e) {
                $('#txtUsuario').dxTextBox('instance').option('disabled', true);
                $('#txtPassword').dxTextBox('instance').option('disabled', true);
                $('#btnLogin').dxButton('instance').option('text', 'Iniciando Sesión...');
                $('#btnLogin').dxButton('instance').option('icon', 'fas fa-cog fa-spin');
            },
            data: this.json(),
            complete: function (jqXHR, textStatus) {
                console.log(jqXHR);
                //$('#btnEntrar').html('<i class="fa fa-fw fa-sign-in-alt"></i>Iniciar Sesión');
                if (textStatus === 'success' && jqXHR.responseJSON.access_token) {
                    localStorage.setItem('Token', jqXHR.responseJSON.access_token);
                    toastr.success('Inicio de sesión correcto, en un momento será redirigido.', 'Bienvenido');
                    setTimeout(function () {
                       window.location = '/';
                    }, 1000);
                } else {
                    $('#btnLogin').dxButton('instance').option('text', 'INICIAR SESIÓN');
                    $('#btnLogin').dxButton('instance').option('icon', 'fas fa-sign-in-alt fa-fw');
                    $('#txtUsuario').dxTextBox('instance').option('disabled', false);
                    $('#txtPassword').dxTextBox('instance').option('disabled', false);
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
            message: "El nombre de usuario es requerido"
        }],
        validationGroup: 'validarLogin'
    });
    $('#txtPassword').dxTextBox({
        type: "text",
        mode:'password',
        placeholder: "Contraseña",
        valueChangeEvent: 'keyup'
    }).dxValidator({
        validationRules: [{
            type: "required",
            message: "La contraseña es requerida"
        }],
        validationGroup: 'validarLogin'
    });

    $('#btnLogin').dxButton({
        type: "default",
        onClick: function (e) {
            let request = new LoginRequest(
                $('#txtUsername').dxTextBox('instance').option('value'),
                $('#txtPassword').dxTextBox('instance').option('value'));
            request.enviarPeticion();
        },
        text:"Ingresar",
        width: "230px",
        icon:'fas fa-sign-in-alt'
    });
});

const enviarPeticion = e => {
   //var peticion new Login();
};
