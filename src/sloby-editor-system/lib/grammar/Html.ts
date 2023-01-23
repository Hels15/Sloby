import { TranslatedElement } from '../../utils/types';
import { BaseClassNames } from './BaseClassNames';

export default class Html {
  /**This will take care of translating the html in order for the preview interface to use */
  generate(translate_to: TranslatedElement, translated_element: any): string {
    /**A method that will generate html based on what is being passed
     * @param {TranslatedElement} translate_to => it will tell that what html element should we translate the string to
     * @param {any} translated_element => The element that will be translated
     * @returns {string} the formatted html string with the translated element
     */
    switch (translate_to) {
      case 'div': {
        return `<div>
          <div className='${BaseClassNames.BASIC_DIV}'>${
          translated_element as string
        }</div>
          <div>94*64</div>
        </div>`;
        // return `<div>
        //   <div  className='${BaseClassNames.BASIC_DIV}'>${
        //   translated_element as string
        // }</div>
        // <div>asd</div>
        // </div>`;
      }
    }
  }
}
