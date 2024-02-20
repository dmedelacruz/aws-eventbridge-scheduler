import {
    CreateScheduleCommand,
    CreateScheduleCommandInput, FlexibleTimeWindowMode,
    SchedulerClient, ScheduleState
} from "@aws-sdk/client-scheduler";
import {awsConfig} from "./AwsConfig";

const schedulerClient = new SchedulerClient(awsConfig);

const awsDetails = {
    scheduleName: "test-scheduler-queue-sdk",
    eventBridgeRole: "arn:aws:iam::542420031244:role/service-role/Amazon_EventBridge_Scheduler_SQS_TEST",
    schedule: "rate(1 minutes)",
    targetQueue: "arn:aws:sqs:us-west-2:542420031244:test-queue.fifo"
}

const payload = {
    key1 : "value1-sdk-ok-wew",
    key2 : "value2-sdk-ok-wew",
    key3 : "value3-sdk-ok-wew"
}

const scheduleDetails: CreateScheduleCommandInput = {
    Name: awsDetails.scheduleName,
    ScheduleExpression: awsDetails.schedule,
    ScheduleExpressionTimezone: "Asia/Manila",
    FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.OFF
    },
    State: ScheduleState.ENABLED,
    Target: {
        Arn: awsDetails.targetQueue,
        RoleArn: awsDetails.eventBridgeRole,
        Input: JSON.stringify(payload),
        SqsParameters: {
            MessageGroupId: "test-group-id"
        }
    }
}

var createScheduleCommand = new CreateScheduleCommand(scheduleDetails);

async function createScheduler() {
    try {
        console.log("Creating Scheduler")
        const scheduleCreated = await schedulerClient.send(createScheduleCommand);
        console.log(scheduleCreated);
    } catch (error) {
        console.error(error);
    }
}

createScheduler().then(r => console.log("OK"));