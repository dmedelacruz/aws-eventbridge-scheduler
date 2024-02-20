"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const AwsConfig_1 = require("./AwsConfig");
//config from IAM user should have Policy related to EventBridge
const awsDetails = {
    ruleName: "test-scheduler-sdk",
    eventBridgeRole: "arn:aws:iam::542420031244:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_0ba81b0fa7",
    schedule: "rate(5 minutes)",
    targetLambda: "arn:aws:lambda:us-west-2:542420031244:function:test-logger"
};
const payload = {
    key1: "value1-sdk- ok",
    key2: "value2-sdk-ok",
    key3: "value3-sdk-ok"
};
const client = new client_eventbridge_1.EventBridgeClient(AwsConfig_1.awsConfig);
const scheduledRuleRequest = {
    Name: awsDetails.ruleName,
    ScheduleExpression: awsDetails.schedule,
    // EventPattern: "STRING_VALUE",
    State: "ENABLED",
    Description: "Test Scheduled Rule",
    RoleArn: awsDetails.eventBridgeRole, //NOTE: Selected Role should trust principal events.amazonaws.com https://stackoverflow.com/questions/59479734/role-cannot-be-assumed-by-events-amazonaws-com
    // EventBusName: "STRING_VALUE", //Omitting this will use default EventBus
};
const targetLambdaRequest = {
    Rule: awsDetails.ruleName,
    Targets: [
        {
            Id: "test-lambda-id",
            Arn: awsDetails.targetLambda,
            Input: JSON.stringify(payload)
        }
    ]
};
const putRuleCommand = new client_eventbridge_1.PutRuleCommand(scheduledRuleRequest);
const putTargetsCommand = new client_eventbridge_1.PutTargetsCommand(targetLambdaRequest);
function createScheduler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Creating Scheduler");
            const ruleCreated = yield client.send(putRuleCommand);
            console.log(ruleCreated);
            const targetPut = yield client.send(putTargetsCommand);
            console.log(targetPut);
        }
        catch (error) {
            console.error(error);
        }
    });
}
createScheduler();
