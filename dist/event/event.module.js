"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const event_controller_1 = require("./event.controller");
const event_service_1 = require("./event.service");
const event_repository_1 = require("./adapters/persistence/repositories/event.repository");
const database_module_1 = require("./infrastructure/database.module");
const core_1 = require("@nestjs/core");
const zod_validation_pipe_1 = require("infrastructure/pipes/zod-validation.pipe");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [event_controller_1.EventController, event_repository_1.EventRepository],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: zod_validation_pipe_1.ZodValidationPipe,
            },
            event_service_1.EventService,
            event_repository_1.EventRepository,
        ],
    })
], EventModule);
