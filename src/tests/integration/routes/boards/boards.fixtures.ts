export class BoardFixture {
    validObject = (): any  => ({ project: 'Some project' })
    postMandatoryFields = (): Array<string>  => ['project']
}

export class TaskFixture {
    validObject = (): any  => ({ 
        title: 'Some Task Title', 
        description: 'Some description for the task',
        status: 'To Do'
    })
    postMandatoryFields = (): Array<string>  => ['title', 'description', 'status']
}