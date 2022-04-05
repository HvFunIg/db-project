import React from 'react'
import '../css/modal.css'

const Modal = ({
                   visible = false,
                   title = '',
                   content = '',
                   footer = '',
                   onClose,
               }) => {

    // создаем обработчик нажатия клавиши Esc
    const onKeydown = (e) => {
        switch (e.key) {
            case 'Escape':
                onClose()
                break
        }
    }

    // c помощью useEffect цепляем обработчик к нажатию клавиш
    React.useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })

    // если компонент невидим, то не отображаем его
    if (!visible) return null

    // или возвращаем верстку модального окна (&times - символ умножения)
    return (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{title}</h3>
                    <span className='modal-close' onClick={onClose}>
            &times;
          </span>
                </div>
                <div className='modal-body'>
                    <div className='modal-content'>{content}</div>
                </div>
                {footer && <div className='modal-footer'>{footer}</div>}
            </div>
        </div>
    )
}
export default Modal;