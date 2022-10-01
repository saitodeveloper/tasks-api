export class UserRegisterFixture {
    validObject = (): any  => ({ 
        username: 'marcossaito', 
        password: '123456',
        name: 'Marcos'
    })
    madatoryFields = (): Array<string>  => ['username', 'password', 'name']
}

export class UserLoginFixture {
    validObject = (): any  => ({ 
        username: 'marcossaito', 
        password: '123456'
    })
    madatoryFields = (): Array<string>  => ['username', 'password']
}