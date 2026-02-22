'use client';
import { experimental_fieldArray, reatomForm, wrap } from '@reatom/core';
import { reatomFactoryComponent } from '@reatom/react';
import { Noop } from '@util/types';
import { Plus, Trash } from 'lucide-react';
import { task, user_gender } from 'pickup-point-db/browser';
import { HTMLProps } from 'react';
import { map, merge, pipe } from 'remeda';
import { z } from 'zod';

import { createRequestSchema } from '@/api/pickup-point/schema';
import { NumberField } from '@/shared/ui/fields/NumberField';
import { TextAreaField } from '@/shared/ui/fields/TextAreaField';
import { TextField } from '@/shared/ui/fields/TextField';

import {
  createDefaultSchedule,
  createScheduleFiled,
  ScheduleField,
  scheduleToString,
} from './fields';

export interface CreateFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  defaultValues?: Partial<formData>;
  onSubmit?: (data: formResult) => ReturnType<Noop>;
}

type formData = task;
type formResult = z.infer<typeof createRequestSchema>;

export const NewTaskForm = reatomFactoryComponent<CreateFormProviderProps>(
  ({ defaultValues, onSubmit }) => {
    const form = reatomForm(
      () => ({
        address: '',
        description: '',
        max_participant: 2,
        name: '',
        projectTasks: experimental_fieldArray({
          create: ({ schedule, ...param }) => ({
            ...param,
            schedule: createScheduleFiled(schedule),
          }),
          initState: [
            {
              gender: null,
              is_active: true,
              schedule: createDefaultSchedule(),
            },
          ],
        }),
      }),
      {
        onSubmit: ({ projectTasks, ...data }) =>
          onSubmit?.(
            merge(data, {
              projectTasks: pipe(
                projectTasks,
                map(({ schedule, ...task }) =>
                  merge(task, { schedule: scheduleToString(schedule) })
                )
              ),
            })
          ),
      }
    );

    const { address, description, max_participant, name, projectTasks } =
      form.fields;

    return function NewPickupPointCardView({ children, className }) {
      return (
        <form
          className={className}
          onSubmit={wrap((e) => {
            e.preventDefault();
            return form.submit();
          })}
        >
          <TextField
            defaultValue={defaultValues?.name ?? ''}
            error={name.validation().triggered && name.validation().error}
            name="Наименование"
            onValueChange={wrap(({ value }) => {
              name.change(value);
            })}
            placeholder="Введите имя"
          />
          <TextField
            defaultValue={defaultValues?.address ?? ''}
            error={address.validation().triggered && address.validation().error}
            name="Адрес"
            onValueChange={wrap(({ value }) => {
              address.change(value);
            })}
            placeholder="Введите адрес"
          />
          <NumberField
            defaultValue={defaultValues?.max_participant ?? max_participant()}
            error={
              max_participant.validation().triggered &&
              max_participant.validation().error
            }
            name="Колличество участников"
            onValueChange={wrap(({ value }) => {
              max_participant.change(value);
            })}
            placeholder="Введите коллиество"
          />
          <TextAreaField
            defaultValue={defaultValues?.description ?? ''}
            error={
              description.validation().triggered &&
              description.validation().error
            }
            name="Описание"
            onValueChange={wrap(({ value }) => {
              description.change(value);
            })}
            placeholder="Введите описание"
          />
          <div>
            <ul className="list">
              <li className="py-4 text-xs fieldset-legend flex items-center gap-2">
                <p>Расписание задачи</p>
                <button
                  className="btn btn-sm btn-square"
                  onClick={wrap(() =>
                    projectTasks.create({
                      gender: null,
                      is_active: true,
                      schedule: createDefaultSchedule(),
                    })
                  )}
                  type="button"
                >
                  <Plus />
                </button>
              </li>

              {projectTasks.array().map((value, index) => (
                <li
                  className="px-0 list-row grid-flow-col auto-cols-auto"
                  key={index}
                >
                  <ScheduleField
                    className="col-start-1 col-end-3"
                    schedule={value.schedule}
                  />
                  <div className="fieldset col-start-1 col-end-4 row-start-2 grid-cols-[auto_auto] items-center justify-self-start gap-3">
                    <div className="flex gap-5">
                      <label className="flex gap-1 items-center">
                        <span>Для всех</span>
                        <input
                          checked={value.gender?.() === null}
                          className="radio"
                          name="schedule_gender"
                          onChange={wrap(() => {
                            value.gender.change(null as never);
                          })}
                          type="radio"
                          value={user_gender.female}
                        />
                      </label>
                      <label className="flex gap-1 items-center">
                        <span>Муж</span>
                        <input
                          checked={value.gender?.() === user_gender.male}
                          className="radio"
                          name="schedule_gender"
                          onChange={wrap(() => {
                            if (value.gender.value() === user_gender.male) {
                              value.gender.change(null as never);
                            } else {
                              value.gender.change('male' as never);
                            }
                          })}
                          type="radio"
                          value={user_gender.male}
                        />
                      </label>
                      <label className="flex gap-1 items-center">
                        <span>Жен</span>
                        <input
                          checked={value.gender?.() === user_gender.female}
                          className="radio"
                          name="schedule_gender"
                          onChange={wrap(() => {
                            value.gender.change('female' as never);
                          })}
                          type="radio"
                          value={user_gender.female}
                        />
                      </label>
                    </div>
                  </div>
                  <label className="fieldset col-start-1 col-end-4 row-start-2 grid-cols-[auto_auto] justify-self-end items-center cursor-pointer">
                    <span className="fieldset-legend inline-block">
                      {value.is_active() ? 'Активная' : 'Не активна'}
                    </span>
                    <input
                      checked={value.is_active()}
                      className="checkbox"
                      onChange={wrap((e) =>
                        value.is_active.set(e.currentTarget.checked)
                      )}
                      type="checkbox"
                    />
                  </label>
                  <button
                    className="btn btn-xs btn-circle col-start-3 col-end-4 row-start-1"
                    onClick={wrap(() => projectTasks.remove(value))}
                    type="button"
                  >
                    <Trash className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex empty:hidden">
            {children ?? (
              <button className="btn w-full mt-1" type="submit">
                Сохранить
              </button>
            )}
          </div>
        </form>
      );
    };
  }
);
