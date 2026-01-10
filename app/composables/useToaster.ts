const toastId = 'toast-id'

const colorToastSuccess = 'success'
const colorToastError = 'error'
const colorToastWarning = 'warning'
const colorToastInfo = 'info'
const colorToastNotify = 'neutral'

let toastCount = 0

function generateToastId() {
    toastCount++
    return `${toastId}-${Date.now()}-${toastCount}`
}

export function useToaster() {
    const toast = useToast()

    const baseAdd = ({
        id = generateToastId(),
        description,
        title,
        icon,
        color,
        progress = true,
        duration = 5000
    }: {
        id?: string,
        description: string,
        title: string,
        icon: string,
        color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral"
        progress?: boolean,
        duration?: number | undefined
    }) => {
        toast.add({
            id,
            title,
            description,
            icon,
            color,
            progress,
            duration,
        })
    }

    const methods = {
        success: ({
            description,
            title = 'Sucesso',
            icon = 'mdi:check-decagram'
        }: {
            description: string,
            title?: string,
            icon?: string
        }) => { baseAdd({ description, title, icon, color: colorToastSuccess }) },

        error: ({
            description,
            title = 'Erro',
            icon = 'mdi:stop-remove'
        }: {
            description: string,
            title?: string,
            icon?: string
        }) => { baseAdd({ description, title, icon, color: colorToastError }) },

        warning: ({
            description,
            title = 'Atenção',
            icon = 'mdi:alert'
        }: {
            description: string,
            title?: string,
            icon?: string
        }) => { baseAdd({ description, title, icon, color: colorToastWarning }) },

        info: ({
            description,
            title = 'Informação',
            icon = 'mdi:information'
        }: {
            description: string,
            title?: string,
            icon?: string
        }) => { baseAdd({ description, title, icon, color: colorToastInfo }) },

        notify: ({
            description,
            title = 'Notificação',
            icon = 'mdi:bell'
        }: {
            description: string,
            title?: string,
            icon?: string
        }) => { baseAdd({ description, title, icon, color: colorToastNotify }) },
    }

    const { success, error, warning, info, notify } = methods

    return {
        success,
        error,
        warning,
        info,
        notify,
    }
}
