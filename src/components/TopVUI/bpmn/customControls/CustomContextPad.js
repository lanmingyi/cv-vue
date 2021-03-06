import {
  assign
} from 'min-dash';

export default class CustomContextPad {
  constructor (bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }

    contextPad.registerProvider(this)
  }

  getContextPadEntries (element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this

    function appendUserTask(event, element) {
        if (autoPlace) {
            const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
            autoPlace.append(element, shape);
        } else {
            appendUserTaskStart(event, element);
        }
    }
    
    function appendUserTaskStart(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
        create.start(event, shape, element);
    }

    return {
      'append.user-task': {
          group: 'model',
          className: 'bpmn-icon-user-task',
          title: translate('Append')+' '+translate('UserTask'),
          action: {
              click: appendUserTask,
              dragstart: appendUserTaskStart
          }
      }
    }
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
]
