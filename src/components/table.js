import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    // Обрабатываем шаблоны перед таблицей (в обратном порядке)
    before.reverse().forEach(subName => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
    });

    // Обрабатываем шаблоны после таблицы
    after.forEach(subName => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
    });
    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Обработчик события change
    root.container.addEventListener('change', () => onAction());

    // Обработчик события reset
    root.container.addEventListener('reset', () => setTimeout(onAction));

    // Обработчик события submit
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
    
        onAction(e.submitter);
    });


    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        // Преобразуем данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
            // Проверяем существование ключа в элементах шаблона
            if (row.elements[key]) {
            // Присваиваем значение соответствующему элементу
                row.elements[key].textContent = item[key];
            }
        });
        // Возвращаем модифицированный контейнер строки
        return row.container;
    });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}