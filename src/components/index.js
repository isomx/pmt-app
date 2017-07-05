import Form from './Form';
import TextField from './TextField';
import DomElem from './DomElem';

export const getComponent = (c) => {
  switch(c.name) {
    case 'Form':
      return Form;
    case 'TextField':
      return TextField;
    default:
      return DomElem;
  }
}
